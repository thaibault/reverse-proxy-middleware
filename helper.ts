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
import {CompilationResult, Mapping, PlainObject} from 'clientnode/type'
import {createConnection as createPlainConnection} from 'net'
import {connect as createSecureConnection} from 'tls'

import {
    APIPostEvaluationExpression,
    APIPreEvaluationExpression,
    EvaluationParameters,
    EvaluationScopeStateAPIs,
    Forwarders,
    HeaderTransformation,
    HTTPServerResponse,
    HTTPServerRequest,
    ResolvedAPIExpressions,
    ResolvedHeaderTransformation,
    ResolvedHeaderTransformations,
    ResolvedForwarder,
    ResolvedForwarders,
    ResolvedStateAPI,
    Socket,
    StateAPI,
    StringReplacer
} from './type'
// endregion
export const EVALUATION_SCOPE_NAMES:Array<string> = [
    'data', 'error', 'request', 'response', 'stateAPIs', 'Tools'
]
// region forwarder
export const applyStateAPIs = async (
    request:HTTPServerRequest,
    response:HTTPServerResponse,
    forwarder:ResolvedForwarder
):Promise<boolean> => {
    const stateAPIScope:EvaluationScopeStateAPIs = {}

    for (const stateAPI of forwarder.stateAPIs) {
        stateAPIScope[stateAPI.name] = {
            configuration: stateAPI,
            error: null,
            response: null
        }
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
                ) as Response & {data:Mapping<unknown>}

                stateAPIScope[stateAPI.name].response!.data =
                    await stateAPIScope[stateAPI.name].response!.json() as
                        PlainObject
            } catch (givenError) {
                error = givenError as Error
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
    console.log('A', forwarders)
    for (const [name, forwarder] of Object.entries(forwarders))
        if (forwarder.useExpression(
            forwarder,
            null,
            request,
            response,
            {
                [name]: {
                    configuration: forwarders,
                    error: null,
                    response: null
                }
            },
            Tools
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
                {name},
                forwarders.base as unknown as ResolvedForwarder,
                givenForwarder as unknown as ResolvedForwarder
            ) as unknown as ResolvedForwarder
            // region normalize header transformations
            const headerTransformations:ResolvedHeaderTransformations = {
                retrieve: [],
                send: []
            }
            for (const type of ['retrieve', 'send'] as const) {
                headerTransformations[type] = []
                for (const givenTransformation of (
                    [] as Array<HeaderTransformation>
                ).concat(
                    forwarder.headerTransformations[type] as
                        unknown as
                        HeaderTransformation
                )) {
                    const transformation:ResolvedHeaderTransformation = {
                        source: ():string => '',
                        target: ():string => ''
                    }

                    if (Object.prototype.hasOwnProperty.call(
                        givenTransformation, 'source'
                    ))
                        if (givenTransformation.source instanceof RegExp)
                            transformation.source = ():RegExp =>
                                givenTransformation.source as RegExp
                        else if (
                            typeof givenTransformation.source === 'string'
                        ) {
                            const result:CompilationResult<RegExp|string> =
                                Tools.stringCompile<RegExp|string>(
                                    givenTransformation.source,
                                    EVALUATION_SCOPE_NAMES
                                )

                            if (result.error)
                                throw new Error(result.error)

                            transformation.source = result.templateFunction
                        } else
                            transformation.source = givenTransformation.source!

                    if (Object.prototype.hasOwnProperty.call(
                        givenTransformation, 'target'
                    ))
                        if (
                            typeof givenTransformation.target === 'string'
                        ) {
                            const result:CompilationResult<
                                string|StringReplacer
                            > = Tools.stringCompile<string|StringReplacer>(
                                givenTransformation.target,
                                EVALUATION_SCOPE_NAMES
                            )

                            if (result.error)
                                throw new Error(result.error)

                            transformation.target = result.templateFunction
                        } else
                            transformation.target = givenTransformation.target!
                }
            }
            forwarder.headerTransformations = headerTransformations
            // endregion
            // region state apis
            const stateAPIs:Array<ResolvedStateAPI> = []
            const givenStateAPIs:Array<StateAPI> =
                ([] as Array<StateAPI>).concat(givenForwarder.stateAPIs || [])
            const baseAPI:StateAPI = givenStateAPIs.filter(
                (api:StateAPI):boolean => api.name === 'base'
            )[0]
            const extendedGivenStateAPIs:Array<StateAPI> = []
            for (const api of givenStateAPIs)
                if (api.name !== 'base')
                    extendedGivenStateAPIs.push(
                        Tools.extend(true, {}, baseAPI, api)
                    )
            for (const api of extendedGivenStateAPIs) {
                api.skipSecrets =
                    ([] as Array<string>).concat(api.skipSecrets || [])
                const expressions:ResolvedAPIExpressions = {pre: [], post: []}
                for (const expression of (
                    [] as Array<APIPreEvaluationExpression>
                ).concat(api.expressions?.pre || []))
                    if (typeof expression === 'string') {
                        const result:CompilationResult<boolean|number> =
                            Tools.stringCompile<boolean|number>(
                                expression, EVALUATION_SCOPE_NAMES
                            )

                        if (result.error)
                            throw new Error(result.error)

                        expressions.pre.push(result.templateFunction)
                    } else
                        expressions.pre.push(expression)
                for (const expression of (
                    [] as Array<APIPostEvaluationExpression>
                ).concat(api.expressions?.post || []))
                    if (typeof expression === 'string') {
                        const result:CompilationResult<number|true> =
                            Tools.stringCompile<number|true>(
                                expression, EVALUATION_SCOPE_NAMES
                            )

                        if (result.error)
                            throw new Error(result.error)

                        expressions.post.push(result.templateFunction)
                    } else
                        expressions.post.push(expression)
                /* eslint-disable @typescript-eslint/no-extra-semi */
                ;(api as unknown as ResolvedStateAPI).expressions = expressions
                /* eslint-enable @typescript-eslint/no-extra-semi */
                stateAPIs.push(api as unknown as ResolvedStateAPI)
            }

            forwarder.stateAPIs = stateAPIs
            // endregion
            // region normalize use expression
            if (typeof givenForwarder.useExpression === 'string') {
                const result:CompilationResult<boolean> =
                    Tools.stringCompile(
                        givenForwarder.useExpression, EVALUATION_SCOPE_NAMES
                    )

                if (result.error)
                    throw new Error(result.error)

                forwarder.useExpression = result.templateFunction
            } else
                forwarder.useExpression = givenForwarder.useExpression!
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
    request:HTTPServerRequest,
    response:HTTPServerResponse,
    buffers:Array<Buffer>,
    forwarder:ResolvedForwarder
):void => {
    const clientSocket:Socket = response.socket
    const createConnection:typeof createSecureConnection = forwarder.tls ?
        createSecureConnection :
        createPlainConnection as unknown as typeof createSecureConnection
    const portSuffix:string = (
        forwarder.tls &&
        forwarder.port !== 443 ||
        !forwarder.tls &&
        forwarder.port !== 80
    ) ?
        `:${String(forwarder.port)}` :
        ''

    const serverSocket = createConnection(
        {
            host: forwarder.host,
            port: forwarder.port,
            ...(forwarder.tls ?
                {servername: forwarder.host, rejectUnauthorized: false} :
                {}
            )
        },
        () => {
            console.info(
                `Proxy to: http${forwarder.tls ? 's' : ''}://` +
                `${forwarder.host}${portSuffix}`
            )
        }
    )
    serverSocket.on('error', (error:Error) => {
        console.error('Proxy to server error', error)
    })

    const parameters:EvaluationParameters = [
        {clientSocket, serverSocket},
        null,
        request,
        response,
        {
            [forwarder.name]: {
                configuration: {[forwarder.name]: forwarder},
                error: null,
                response: null
            }
        },
        Tools
    ]

    // Send data from server back to client.
    if (forwarder.headerTransformations.retrieve.length) {
        let headerProcessed = false
        serverSocket.on('data', (buffer:Buffer):void => {
            if (headerProcessed) {
                clientSocket.write(buffer)

                return
            }

            let content:string = buffer.toString()
            for (
                const replacement of forwarder.headerTransformations.retrieve
            )
                try {
                    const source:RegExp|string =
                        replacement.source(...parameters)
                    const target:string|StringReplacer =
                        replacement.target(...parameters)

                    content = content.replace(source, target as string)
                } catch (error) {
                    console.warn(
                        'Could not apply header transformation:', error
                    )
                }
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

                if (forwarder.tls)
                    // NOTE: TLS support was introduced in version 1.1.
                    content = content.replace(/HTTP\/1\.0/i, 'HTTP/1.1')

                // Overwrite proxy host with destination one.
                content = content.replace(
                    /(($|\n)host: )[^\n]+/i, `$1${forwarder.host}${portSuffix}`
                )

                for (
                    const replacement of forwarder.headerTransformations.send
                )
                    try {
                        const source:RegExp|string =
                            replacement.source(...parameters)
                        const target:string|StringReplacer =
                            replacement.target(...parameters)

                        content = content.replace(source, target as string)
                    } catch (error) {
                        console.warn(
                            'Could not apply header transformation:', error
                        )
                    }

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
