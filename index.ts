// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module web-node */
'use strict'
/* !
    region header
    [Project page](https://torben.website/webNode)

    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
// NOTE: http2 compatibility mode does work for unencrypted connections yet.
import Tools from 'clientnode'
import {createServer as createHTTP1Server} from 'http'
import {
    createServer,
    createSecureServer,
    Http2ServerResponse as HTTPServerResponse,
    Http2ServerRequest as HTTPServerRequest,
    Http2Stream as HTTPStream,
    OutgoingHttpHeaders as OutgoingHTTPHeaders
} from 'http2'
import {createConnection as createPlainConnection} from 'net'
import {resolve} from 'path'
import {connect as createSecureConnection} from 'tls'

import packageConfiguration from './package.json'
import {
    BufferedHTTPServerRequest, BufferedSocket, Configuration, Server, Socket
} from './type'
// endregion
// region configuration
const CONFIGURATION:Configuration = packageConfiguration.configuration
const configurationPath:string = resolve(process.cwd(), 'configuration.json')
if (Tools.isFileSync(configurationPath))
    Tools.extend(
        true,
        CONFIGURATION,
        eval(`require('${configurationPath}')`) as Configuration
    )
const createConnection:typeof createSecureConnection =
    CONFIGURATION.forward.tls ?
        createSecureConnection :
        createPlainConnection as unknown as typeof createSecureConnection
const portSuffix:string = (
    CONFIGURATION.forward.tls &&
    CONFIGURATION.forward.port !== 443 ||
    !CONFIGURATION.forward.tls &&
    CONFIGURATION.forward.port !== 80
) ?
    `:${CONFIGURATION.forward.port}` :
    ''
// endregion
// region helper
const reverseProxyBufferedRequest = (
    clientSocket:Socket, buffers:Array<Buffer>
):void => {
    const serverSocket = createConnection(
        {
            host: CONFIGURATION.forward.host,
            port: CONFIGURATION.forward.port,
            ...(CONFIGURATION.forward.tls ?
                {
                    servername: CONFIGURATION.forward.host,
                    rejectUnauthorized: false
                } :
                {}
            )
        },
        () => {
            console.info(
                `Proxy to: http${CONFIGURATION.forward.tls ? 's' : ''}` +
                `://${CONFIGURATION.forward.host}${portSuffix}`
            )
        }
    )
    serverSocket.on('error', (error:Error) => {
        console.error('Proxy to server error', error)
    })

    // Send data from server back to client.
    if (CONFIGURATION.forward.headerTransformation.retrieve.length) {
        let headerProcessed = false
        serverSocket.on('data', (buffer:Buffer):void => {
            if (headerProcessed) {
                clientSocket.write(buffer)

                return
            }

            let content:string = buffer.toString()
            for (
                const replacement of
                CONFIGURATION.forward.headerTransformation.retrieve
            )
                content = content.replace(
                    replacement.source, replacement.target as string
                )

            clientSocket.write(content)

            headerProcessed = true
        })
    } else
        serverSocket.pipe(clientSocket)

    serverSocket.on('connect', () => {
        let headerProcessed = false
        for (const buffer of buffers) {
            if (!headerProcessed) {
                let content:string = buffer.toString()

                if (CONFIGURATION.forward.tls)
                    // NOTE: TLS support was introduced in version 1.1.
                    content = content.replace(/HTTP\/1\.0/i, 'HTTP/1.1')

                // Overwrite proxy host with destination one.
                content = content.replace(
                    /(($|\n)host: )[^\n]+/i,
                    `$1${CONFIGURATION.forward.host}${portSuffix}`
                )

                for (
                    const replacement of
                    CONFIGURATION.forward.headerTransformation.send
                )
                    content = content.replace(
                        replacement.source, replacement.target as string
                    )

                console.info(`Send:\n\n${content}`)

                serverSocket.write(content)

                headerProcessed = true
                continue
            }

            serverSocket.write(buffer)
        }
    })
}
// endregion
// region live cycle methods
const onIncomingMessage = (
    request:HTTPServerRequest, response:HTTPServerResponse
):void => {
    const bufferedRequest = request as BufferedHTTPServerRequest

    void (async ():Promise<void> => {
        if (request.headers.response) {
            response.write(request.headers.response as string)
            response.end()

            return
        }

        // NOTE: We have to wait until client request is fully buffered.
        await Tools.timeout()

        reverseProxyBufferedRequest(
            response.socket, bufferedRequest.socket.buffers
        )
    })()
}

const onIncomingStream = (
    stream:HTTPStream, headers:OutgoingHTTPHeaders
):void => {
    console.info('Got stream', stream, headers)
}
// endregion
// region initialize server
const server:Server = {
    instance: CONFIGURATION.publicKeyPath && CONFIGURATION.privateKeyPath ?
        createSecureServer(
            CONFIGURATION.nodeServerOptions, onIncomingMessage
        ) :
        // NOTE: See import notice.
        (createHTTP1Server as unknown as typeof createServer)(
            onIncomingMessage
        ),
    streams: [],
    sockets: [],

    start: ():void => {
        server.instance.listen(
            CONFIGURATION.port,
            CONFIGURATION.host,
            ():void => console.info('Server started.')
        )
    },
    stop: ():void => {
        server.instance.close(():void => {
            console.info('Shut server down.')
        })

        for (const connections of [server.sockets, server.streams])
            if (Array.isArray(connections))
                for (const connection of connections)
                    connection.destroy()
    }
}

server.instance.on(
    'connection',
    (socket:BufferedSocket):void => {
        const buffers:Array<Buffer> = []
        socket.on('data', (data:Buffer):void => {
            buffers.push(data)
        })
        socket.buffers = buffers

        server.sockets.push(socket)

        socket.on('close', ():void => {
            server.sockets.splice(server.sockets.indexOf(socket), 1)
        })
    }
)

server.instance.on(
    'stream',
    (stream:HTTPStream, headers:OutgoingHTTPHeaders):void => {
        server.streams.push(stream)

        onIncomingStream(stream, headers)

        stream.on('close', ():void => {
            server.streams.splice(server.streams.indexOf(stream), 1)
        })
    }
)
// endregion
if (require.main === module || eval('require.main') !== require.main) {
    console.info('Start server with configuration:', CONFIGURATION)
    server.start()
}

export default server
/*
    def overwrite_normal_request(cls, token, data, rest_controller):
        '''Overwrites normal result with failing recaptcha id.'''
        data = {}
        if token is not None:
            if isinstance(token, int):
                data = {'id': token}
            elif ' ' in token:
                data = {'id': int(token[:token.find(' ')])}
        return (
            data, rest_controller.mime_type,
            rest_controller.cache_control_header, None)

    def before_response_interceptor(cls, data, rest_controller):
        '''Check whether given form is valid against human check.'''
        result = None
        if (
            not (
                (
                    cls.agile.web_node.debug or
                    'staging' in cls.agile.web_node.given_command_line_arguments.flags
                ) and
                isinstance(rest_controller.web_node.request['data'], dict) and
                rest_controller.web_node.request['handler'].headers.get(
                    're-captcha-skip'
                ) == 'true' or
                rest_controller.web_node.request['handler'].headers.get(
                    're-captcha-skip'
                ) == 'true' and
                rest_controller.web_node.request['handler'].headers.get(
                    're-captcha-skip-secret'
                ) in cls.agile.web_node.options[__plugin_name__]['skipSecrets']
            ) and
            '%s:%s' % (
                rest_controller.web_node.request['type'].upper(),
                rest_controller.web_node.request['uri']
            ) in cls.agile.web_node.options[__plugin_name__]['requestsToCheck']
        ):
            token = rest_controller.web_node.request['handler'].headers.get(
                'g-recaptcha-response', ''
            )
            try:
                response = urlopen(
                    cls.agile.web_node.options[__plugin_name__][
                        'applicationInterface-v' + application_interface_version
                    ]['url'].format(
                        response=token[token.find(' ') + 1:],
                        secret=cls.agile.web_node.options[__plugin_name__][
                            'applicationInterface-v' + application_interface_version
                        ]['key'])
                ).read()
            except IOError as exception:

                __logger__.warn(
                    'Request "%s" couldn\'t be identified as robot or '
                    'human because the recaptcha service produces the '
                    'following error: %s: %s',
                    rest_controller.web_node.request['uri'],
                    exception.__class__.__name__,
                    convert_to_unicode(exception)
                )
                if cls.agile.web_node.options[__plugin_name__][
                    'identifiyAsHumanIfServiceThrowsException'
                ]:
                    __logger__.info(
                        'Request "%s" identified as human triggered caused by '
                        'fallback configuration.',
                        rest_controller.web_node.request['uri']
                    )
                    return
                rest_controller.web_node.request['handler'].send_response(502)
                return cls.overwrite_normal_request(
                    token, data, rest_controller)
            else:
                if (
                    token and
                    (
                        'TODO temporary disabled' or
                        (
                            json.loads(response).get('success', False) or
                            json.loads(response).get('score', 0) >= 0.01
                        )
                    )
                ):
                    __logger__.info(
                        'Request "%s" identified as human triggered.',
                        rest_controller.web_node.request['uri'])
                    return
                __logger__.info(
                    'Request "%s" identified as robot triggered. Token "%s", '
                    'response: "%s"',
                    rest_controller.web_node.request['uri'],
                    token,
                    json.loads(response)
                )
                rest_controller.web_node.request['handler'].send_response(420)
                return cls.overwrite_normal_request(
                    token, data, rest_controller)

    def get_manifest_scope(cls, data, *arguments, **keywords):
        '''Add plugins specific urls to manifest.'''
        if 'url' not in data['assetFiles'].add(data['options'][__plugin_name__][
            'applicationInterface-v' + application_interface_version
        ]):
            return data
        for protocol in ('http', 'https'):
            data['assetFiles'].add(data['options'][__plugin_name__][
                'applicationInterface-v' + application_interface_version
            ]['url']
                .replace('{1}', protocol)
                .replace(
                    '{2}',
                    data['options'][__plugin_name__][
                        'applicationInterface-v' + application_interface_version
                    ]['callbackFunctionName']
                )
            )
            for url in data['options'][__plugin_name__][
                'applicationInterface-v' + application_interface_version
            ]['preLoadingURLs']:
                data['assetFiles'].add(url.replace('{1}', protocol))
        return data
*/
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
