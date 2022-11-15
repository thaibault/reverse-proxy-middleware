// NOTE: http2 compatibility mode does work for unencrypted connections yet.
import {createServer as createHTTP1Server} from 'http'
import {
    createServer,
    createSecureServer,
    Http2Server as HttpServer,
    Http2ServerResponse as HTTPServerResponse,
    Http2ServerRequest as HTTPServerRequest,
    Http2SecureServer as HTTPSecureServer,
    Http2Stream as HTTPStream,
    OutgoingHttpHeaders as OutgoingHTTPHeaders,
    SecureServerOptions
} from 'http2'
import {createConnection, Socket} from 'net'

interface APIConfiguration {
    key:string,
    url:string
}
type APIConfigurations = {
    base:APIConfiguration
    [key:string]:Partial<APIConfiguration>
}

interface Configuration {
    publicKeyPath:string
    privateKeyPath:string

    nodeServerOptions:SecureServerOptions
    port:number

    forward:{
        url:string
    }

    humanChecker:{
        applicationInterfaces:APIConfigurations
        identifiyAsHumanIfServiceThrowsException:boolean
        skipSecrets:Array<string>
    }
}

type HTTPServer = HttpServer|HTTPSecureServer

interface Server {
    instance:HTTPServer
    streams:Array<HTTPStream>
    sockets:Array<Socket>
}


const CONFIGURATION:Configuration = {
    publicKeyPath: '',
    privateKeyPath: '',

    nodeServerOptions: {
        allowHTTP1: true
    },
    port: 8080,

    forward: {
        url: 'www.google.com'
    },

    humanChecker: {
        applicationInterfaces: {
            base: {
                key: '',
                url: 'https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={response}'
            },
            googleV2: {
                key: ''
            },
            googleV3: {
                key: ''
            }
        },
        identifiyAsHumanIfServiceThrowsException: true,
        skipSecrets: []
    }
}


const onIncomingMessage = (
    request:HTTPServerRequest, response:HTTPServerResponse
):void => {
    console.log('Got request'/*, request, response*/)

    // response.end()
}

const onIncomingStream = (
    stream:HTTPStream, headers:OutgoingHTTPHeaders
):void => {
    console.log('Got stream', stream, headers)
}


const server:Server = {
    instance: CONFIGURATION.publicKeyPath && CONFIGURATION.privateKeyPath ?
        createSecureServer(
            CONFIGURATION.nodeServerOptions//, onIncomingMessage
        ) :
        // NOTE: See import notice.
        (createHTTP1Server as unknown as typeof createServer)(
            //onIncomingMessage
        ),
    streams: [],
    sockets: []
}


server.instance.on(
    'connection',
    (socket:Socket):void => {
        // server.sockets.push(socket)

        // Creating a connection from proxy to destination server
        const proxyToServerSocket = createConnection(
            {
                allowHalfOpen: true,
                host: CONFIGURATION.forward.url,
                port: 80
            },
            () => {
                console.log('Proxy data to:', CONFIGURATION.forward.url)
            }
        )

        socket.pipe(proxyToServerSocket)
        proxyToServerSocket.pipe(socket)

        proxyToServerSocket.on('error', (err) => {
            console.log('Proxy to server error')
            console.log(errpr)
        })

        proxyToServerSocket.on('close', () => {
            console.log('CLOSE')
        })

        socket.on('error', (error) => {
            console.log('Client to proxy error');
            console.log(error)
        })

        /*
        socket.on('close', ():Array<Socket> =>
            server.sockets.splice(server.sockets.indexOf(socket), 1)
        )
        */
    }
)

/*
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
*/


const start = () =>
    server.instance.listen(
        CONFIGURATION.port, 'localhost', () => console.log('Server started')
    )

const close = () => {
    server.instance.close(():void => {
        console.log('Shut server down')
    })

    for (const connections of [server.sockets, server.streams])
        if (Array.isArray(connections))
            for (const connection of connections)
                connection.destroy()
}

start()

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
