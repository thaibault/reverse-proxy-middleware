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
import {RecursivePartial} from 'clientnode/type'
import {createServer as createHTTP1Server} from 'http'
import {createServer, createSecureServer} from 'http2'
import {resolve} from 'path'

import reverseProxyBufferedRequest, {
    addParsedContentToRequest,
    applyStateAPIs,
    determineForwarder,
    logging,
    resolveForwarders
} from './helper'
import packageConfiguration from './package.json'
import {
    BufferedHTTPServerRequest,
    BufferedSocket,
    Configuration,
    HTTPServerResponse,
    HTTPServerRequest,
    HTTPStream,
    OutgoingHTTPHeaders,
    ResolvedForwarder,
    ResolvedForwarders,
    Server
} from './type'
// endregion
declare const ORIGINAL_MAIN_MODULE:object
// region live cycle methods
const onIncomingMessage = (
    request:HTTPServerRequest, response:HTTPServerResponse
):void => {
    const bufferedRequest:BufferedHTTPServerRequest =
        request as BufferedHTTPServerRequest

    void (async ():Promise<void> => {
        void logging.info(
            `|${'-'.repeat(80 - 2)}|\nStart processing`,
            `${bufferedRequest.method} request: ${bufferedRequest.url}\n` +
            (bufferedRequest as unknown as string)
        )

        // NOTE: We have to wait until client request is fully buffered.
        while (true) {
            await Tools.timeout()

            if (bufferedRequest.socket.buffer.finished)
                break
        }

        if (CONFIGURATION.parseBody)
            addParsedContentToRequest(bufferedRequest)

        const forwarder:ResolvedForwarder|null =
            determineForwarder(bufferedRequest, response, FORWARDERS)

        if (forwarder === null) {
            void logging.error(
                'No forwarder found for given request:', bufferedRequest
            )

            response.statusCode = 502
            response.end()

            return
        }

        try {
            const {result, scope} =
                await applyStateAPIs(bufferedRequest, response, forwarder)
            if (result)
                await reverseProxyBufferedRequest(
                    bufferedRequest, response, forwarder, scope
                )
        } catch (error) {
            void logging.error(error)
        }

        void logging.info(
            `\nEnd processing`,
            `${bufferedRequest.method} request: ${bufferedRequest.url}\n` +
            `${bufferedRequest as unknown as string}|${'-'.repeat(80 - 2)}|`
        )
    })()
}

const onIncomingStream = (
    stream:HTTPStream, headers:OutgoingHTTPHeaders
):void => {
    void logging.info('Got stream', stream, headers)
}
// endregion
// region configuration
const BASE_CONFIGURATION:Configuration = packageConfiguration.configuration

for (const path of [
    'configuration.json', 'secure-configuration.json'
] as const) {
    const configurationPath:string = resolve(process.cwd(), path)
    if (Tools.isFileSync(configurationPath)) {
        const configuration:RecursivePartial<Configuration> =
            eval(`require('${configurationPath}')`) as
                RecursivePartial<Configuration>

        Tools.extend(
            true,
            Tools.modifyObject<Configuration>(
                BASE_CONFIGURATION, configuration
            )!,
            configuration
        )
    }
}
const CONFIGURATION:Configuration = Tools.evaluateDynamicData<Configuration>(
    BASE_CONFIGURATION,
    {configuration: BASE_CONFIGURATION, environment: process.env, Tools}
)
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
            ():void => {
                void logging.info(
                    `Listen on port ${CONFIGURATION.port} for incoming ` +
                    'requests.'
                )
            }
        )
    },
    stop: ():void => {
        server.instance.close(():void => {
            void logging.info('Shut server down.')
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
        server.sockets.push(socket)

        socket.buffer = {
            data: [],
            finished: false
        }
        socket.on('data', (data:Buffer):void => {
            socket.buffer.data.push(data)
        })
        for (const name of [
            'done', 'finish', 'writableEnded', 'writableFinished'
        ])
            socket.on(name, ():void => {
                socket.buffer.finished = true
            })
        /*
            NOTE: Workaround since none of the events above trigger before
            responding to client occurred.
        */
        void Tools.timeout(():void => {
            socket.buffer.finished = true
        })

        socket.on('close', ():void => {
            socket.buffer.finished = true

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
if (
    require.main === module ||
    eval('require.main') !== require.main &&
    typeof ORIGINAL_MAIN_MODULE !== 'undefined' &&
    ORIGINAL_MAIN_MODULE === eval('require.main')
) {
    void logging.info(
        'Start server with configuration:', Tools.represent(CONFIGURATION)
    )
    void logging.debug('Apply resolved forwarder:', Tools.represent(FORWARDERS))

    server.start()

    for (const name of CloseEventNames)
        process.on(name, ():void => {
            void logging.info(`\nGot "${name}" signal: stopping server.`)

            server.stop()
        })
}
// endregion
export default server
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
