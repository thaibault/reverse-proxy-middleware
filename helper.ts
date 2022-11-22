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
// region forwarder
export const applyStateAPIs = async (
    request:HTTPServerRequest,
    response:HTTPServerResponse,
    forwarder:ResolvedForwarder
):Promise<boolean> => {
    const stateAPIScope:Mapping<unknown> = {}

    for (const stateAPI of forwarder.stateAPIs) {
        stateAPIScope[stateAPI.name] = {...stateAPI}
        let useStateAPI = false

        for (const expression of stateAPI.expressions.pre) {
            const result:boolean|number = expression(
                stateAPI.data,
                null,
                request,
                response,
                stateAPIScope,
                Tools
            )

            if (typeof result === 'number') {
                console.info(
                    'Break request caused by state api ' +
                    `"${stateAPI.name}" with status code ${result}.`
                )

                response.statusCode = result
                response.end()

                return false
            }

            if (result)
                useStateAPI = true
            else
                break
        }

        if (useStateAPI) {
            console.info(`Use state api "${stateAPI.name}".`)

            if (hasSkipSecret(request, stateAPI)) {
                console.info(
                    `Skip state api "${stateAPI.name}" causes by ` +
                    'determined skip secret.'
                )

                break
            }

            let error:Error|null = null
            try {
                stateAPIScope[stateAPI.name].response = await fetch(
                    stateAPI.url, stateAPI.options
                )

                stateAPIScope[stateAPI.name].response.data =
                    await stateAPIScope[stateAPI.name].response.json()
            } catch (givenError) {
                error = givenError
                console.warn(
                    `State api "${stateAPI.name}" throws error:`, error
                )
            }

            for (const expression of stateAPI.expressions.post) {
                const result:number|true = expression(
                    stateAPI.data,
                    error,
                    request,
                    response,
                    stateAPIScope,
                    Tools
                )

                if (typeof result === 'number') {
                    console.info(
                        'Break request caused by state api ' +
                        `"${stateAPI.name}" with status code ${result}.`
                    )

                    response.statusCode = result
                    response.end()

                    return false
                }
            }
        }
    }

    return true
}
export const determineForwarder = (
    request:HTTPServerRequest,
    response:HTTPServerResponse,
    forwarders:ResolvedForwarders
):ResolvedForwarder|null => {
    for (const [name, forwarder] of Object.entries(forwarders))
        if (forwarder.useExpression(
            forwarder, null, request, response, forwarder.stateAPIs, Tools
        )) {
            console.info(`Determined forwarder "${name}."`)

            return forwarder
        }

    return null
}
export const resolveForwarders = (forwarders:Forwarders):ResolvedForwarders => {
    const resolvedForwarders:ResolvedForwarders = {}
    for (const [name, givenForwarder] of Object.entries(forwarders))
        if (name !== 'base') {
            const forwarder:ResolvedForwarder = Tools.extend(
                true,
                {},
                forwarders.base,
                givenForwarder
            )
            // region normalize header transformations
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
                            if (givenTransformation.source instanceof RegExp)
                                transformation.source =
                                    ():RegExp => givenTransformation.source
                            else {
                                const result:CompilationResult<RegExp|string> =
                                    Tools.stringCompile<RegExp|string>(
                                        givenTransformation.source,
                                        EVALUATION_SCOPE_NAMES
                                    )

                                if (result.error)
                                    throw new Error(result.error)

                                transformation.source = result.templateFunction
                            }
                        else
                            transformation.source = ():string => ''

                        if (Object.prototype.hasOwnProperty.call(
                            givenTransformation, 'target'
                        ))
                            if (
                                typeof givenTransformation.target ===
                                    'function'
                            )
                                transformation.target = ():StringReplacer =>
                                    givenTransformation.target
                            else {
                                const result:CompilationResult<
                                    string|StringReplacer
                                > = Tools.stringCompile<string|StringReplacer>(
                                    givenTransformation.target,
                                    EVALUATION_SCOPE_NAMES
                                )

                                if (result.error)
                                    throw new Error(result.error)

                                transformation.target = result.templateFunction
                            }
                        else
                            transformation.source = ():string => ''
                    }
                }
            forwarder.headerTransformations = headerTransformations
            // endregion
            // region state apis
            const stateAPIs:Array<ResolvedAPIConfiguration> = []
            const givenStateAPIs:Array<ApiConfiguration> =
                ([] as Array<APIConfiguration>)
                    .concat(givenForwarder.stateAPIs)
            const baseAPI:APIConfiguration = givenStateAPIs.filter(
                (api:APIConfiguration):boolean => api.name === 'base'
            )[0]
            const extendedGivenStateAPIs:Array<APIConfiguration> = []
            for (const api of givenStateAPIs)
                if (api.name !== 'base')
                    extendedGivenStateAPIs.push(
                        Tools.extend(true, {}, baseAPI, api)
                    )
            for (const api of extendedGivenStateAPIs) {
                api.skipSecrets = ([] as Array<string>).concat(api.skipSecrets)
                const expressions:ResolvedAPIExpressions = {pre: [], post: []}
                for (const expression of ([] as Array<string>).concat(
                    api.expressions.pre
                )) {
                    const result:ComilationResult<boolean|number> =
                        Tools.stringCompile<boolean|number>(
                            expression, SCOPE_EVALUATION_NAMES
                        )

                    if (result.error)
                        throw new Error(result.error)

                    expressions.pre.push(result.templateFunction)
                }
                for (const expression of ([] as Array<string>).concat(
                    api.expressions.post
                )) {
                    const result:ComilationResult<number|true> =
                        Tools.stringCompile<number|true>(
                            expression, SCOPE_EVALUATION_NAMES
                        )

                    if (result.error)
                        throw new Error(result.error)

                    expressions.pre.push(result.templateFunction)
                }
                api.expressions = expressions
                stateAPIs.push(api)
            }

            forwarder.stateAPIs = stateAPIs
            // endregion
            // region normalize use expression
            const result:CompilationResult<RegExp|string> =
                Tools.stringCompile(
                    givenForwarder.useExpression, EVALUATION_SCOPE_NAMES
                )

            if (result.error)
                throw new Error(error)

            forwarder.useExpression = result.templateFunction
            // endregion
            resolvedForwarders[name] = forwarder
        }

    return resolvedForwarders
}
export const hasSkipSecret = (
    request:HTTPServerRequest, stateAPI:ResolvedStateAPI
):boolean =>
    request.headers['reverse-proxy-middleware-skip'] === 'true' &&
    Boolean(request.headers['reverse-proxy-middleware-skip-secret']) &&
    stateAPI.skipSecrets.includes(
        ([] as Array<string>).concat(
            request.headers['reverse-proxy-middleware-skip-secret'] as string
        )[0]
    )
// endregion
export const reverseProxyBufferedRequest = (
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

export default reverseProxyBufferedRequest
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
