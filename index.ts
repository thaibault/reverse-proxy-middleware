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
import Tools, {CloseEventNames} from 'clientnode'
import {EvaluationResult, PlainObject} from 'clientnode/type'
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
    ResolvedAPIConfigurations,
    BufferedHTTPServerRequest,
    BufferedSocket,
    Configuration,
    Forwarders,
    ResolvedForwarder,
    ResolvedForwarders,
    Server,
    Socket
} from './type'
// endregion
// region helper
/// region forwarder
const determineForwarder = (
    request:HTTPServerRequest
):ResolvedForwarder|null => {
    for (const [name, forwarder] of Object.entries(FORWARDER))
        if (
            forwarder.identifier &&
            typeof forwarder.identifier === 'string' &&
            request.url === forwarder.identifier ||
            forwarder.identifier instanceof RegExp &&
            forwarder.identifier.test(request.url)
        ) {
            console.info(`Determined forwarder "${name}."`)

            return forwarder
        }

    return null
}
const resolveForwarders = (forwarders:Forwarders):ResolvedForwarders => {
    const resolvedForwarders:ResolvedForwarders = {}
    for (const [name, givenForwarder] of Object.entries(forwarders))
        if (name !== 'base') {
            const forwarder:ResolvedForwarder = Tools.extend(
                true,
                {},
                forwarders.base,
                givenForwarder
            )

            const headerTransformations:ResolvedHeaderTransformations = {
                retrieve: [],
                send: []
            }
            for (const type of ['retrieve', 'send'] as const)
                for (const givenTransformations of (
                    [] as Array<HeaderTransformation>
                ).concat(forwarder.headerTransformations[type])) {
                    headerTransformations[type] = []

                    for (const givenTransformation of givenTransformations) {
                        const transformation:ResolvedHeaderTransformation = {}
                        if (Object.prototype.hasOwnProperty.call(
                            givenTransformation, 'source'
                        ))
                            transformation.source = ():string => ''
                        else
                            transformation.source = Tools.stringCompile<
                                RegExp|string
                            >(
                                givenTransformation.source,
                                EVALUATION_SCOPE_NAMES
                            )
                    }
                }

            resolvedForwarder.headerTransformations =
                resolvedHeaderTransformations

            resolvedForwarders[name] = forwarder
        }

    return resolvedForwarders
}
/// endregion
const hasSkipSecret = (request:HTTPServerRequest):boolean =>
    request.headers['reverse-proxy-middleware-skip'] === 'true' &&
    Boolean(request.headers['reverse-proxy-middleware-skip-secret']) &&
    CONFIGURATION.humanChecker.skipSecrets.includes(
        ([] as Array<string>).concat(
            request.headers['reverse-proxy-middleware-skip-secret'] as string
        )[0]
    )

const isValid = async (request:HTTPServerRequest):Promise<boolean|null> => {
    if (hasSkipSecret(request))
        return true

    for (const [name, checker] of Object.entries(APPLICATION_INTERFACES)) {
        const clientToken:string|undefined = ([] as Array<string|undefined>)
            .concat(request.headers[checker.headerName])[0]
        if (clientToken) {
            const urlEvaluationResult:EvaluationResult<string> =
                Tools.stringEvaluate(
                    `\`${checker.url}\``,
                    {
                        clientToken: clientToken.substring(
                            clientToken.indexOf(' ') + 1
                        ),
                        secret: checker.secret
                    }
                )

            if (urlEvaluationResult.error) {
                console.error(
                    'Error while evaluation checker url:',
                    urlEvaluationResult.error
                )
                continue
            }

            const url:string = urlEvaluationResult.result

            try {
                const response:PlainObject = (await (await fetch(
                    url, checker.options
                )).json()) as PlainObject

                if (
                    response.success ||
                    typeof response.score === 'number' &&
                    response.score >= checker.score
                ) {
                    console.info(
                        `Request "${url}" (${name}) identified as human ` +
                        'triggered.'
                    )

                    return true
                }

                console.info(
                    `Request "${url}" (${name}) identified as robot ` +
                    'triggered:',
                    response
                )

                return false
            } catch (error) {
                console.warn(
                    `Request to "${url}" (${name}) couldn't be identified as` +
                    'robot or human because the recaptcha service produces ' +
                    'the following error:',
                    error
                )

                if (checker.identifiyAsHumanIfServiceThrowsException) {
                    console.info(
                        'Request will be interpret as human triggered caused' +
                        'by fallback configuration.'
                    )

                    return true
                }

                return null
            }
        }
    }

    return Object.keys(APPLICATION_INTERFACES).length === 0
}

const reverseProxyBufferedRequest = (
    clientSocket:Socket, buffers:Array<Buffer>, forwarder:ResolvedForwarder
):void => {
    const createConnection:typeof createSecureConnection = forwarder.tls ?
        createSecureConnection :
        createPlainConnection as unknown as typeof createSecureConnection
    const portSuffix:string = (
        forwarder.tls &&
        forwarder.port !== 443 ||
        !forwarder.tls &&
        forwarder.port !== 80
    ) ?
        `:${forwarder.port}` :
        ''

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
                `Proxy to: http${CONFIGURATION.forward.tls ? 's' : ''}://` +
                `${CONFIGURATION.forward.host}${portSuffix}`
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
        const result:boolean|null = await isValid(request)

        if (result === null) {
            response.statusCode = 502
            response.end()

            return
        }

        if (result) {
            // NOTE: We have to wait until client request is fully buffered.
            await Tools.timeout()

            const forwarder:ResolvedForwarder|null =
                determineForwarder(request)

            if (forwarder)
                reverseProxyBufferedRequest(
                    response.socket, bufferedRequest.socket.buffers, forwarder
                )
            else {
                console.error('No forwarder found for given request:', request)

                response.statusCode = 502
                response.end()
            }

            return
        }

        response.statusCode = CONFIGURATION.humanChecker.botDetectionStatusCode
        response.end()
    })()
}

const onIncomingStream = (
    stream:HTTPStream, headers:OutgoingHTTPHeaders
):void => {
    console.info('Got stream', stream, headers)
}
// endregion
// region configuration
const CONFIGURATION:Configuration = packageConfiguration.configuration

for (const path of [
    'configuration.json', 'secure-configuration.json'
] as const) {
    const configurationPath:string = resolve(process.cwd(), path)
    if (Tools.isFileSync(configurationPath))
        Tools.extend(
            true,
            CONFIGURATION,
            Tools.evaluateDynamicData<Configuration>(
                eval(`require('${configurationPath}')`) as Configuration,
                {
                    configuration: CONFIGURATION,
                    environment: process.env,
                    Tools
                }
            )
        )
}
const EVALUATION_SCOPE_NAMES = [
    'error', 'request', 'response', 'stateAPIs', 'Tools'
] as const 
const FORWARDERS:ResolvedForwarders =
    resolveForwarders(CONFIGURATION.forwarders)
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
            ():void =>
                console.info(
                    `Listen on port ${CONFIGURATION.port} for incoming ` +
                    'requests.'
                )
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
// region start / stop
if (require.main === module || eval('require.main') !== require.main) {
    console.info(
        'Start server with configuration:', Tools.represent(CONFIGURATION)
    )

    server.start()

    for (const name of CloseEventNames)
        process.on(name, ():void => {
            console.info(`\nGot "${name}" signal: stopping server.`)

            server.stop()
        })
}
// endregion
export default server
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
