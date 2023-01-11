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
    BufferedHTTPServerRequest,
    EvaluationParameters,
    EvaluationScopeStateAPIs,
    Forwarders,
    HeaderTransformation,
    HTTPServerResponse,
    ParsedContent,
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
    request:BufferedHTTPServerRequest,
    response:HTTPServerResponse,
    forwarder:ResolvedForwarder
):Promise<{result:boolean, scope:EvaluationScopeStateAPIs}> => {
    const stateAPIScope:EvaluationScopeStateAPIs = {}

    for (const stateAPI of forwarder.stateAPIs) {
        stateAPIScope[stateAPI.name] = {
            configuration: stateAPI,
            error: null,
            response: null
        }
        let useStateAPI = false

        let index = 1
        for (const expression of stateAPI.expressions.pre) {
            let result:'break'|boolean|'continue'|number = 'break'
            try {
                result = expression(
                    stateAPI.data,
                    null,
                    request,
                    response,
                    stateAPIScope,
                    Tools
                )
            } catch (error) {
                console.warn(
                    `Failed running pre ${index}. expression of state api:`,
                    error
                )
            }

            if (typeof result === 'number') {
                console.info(
                    'Break request caused by state api ' +
                    `"${stateAPI.name}" with status code ${result}.`
                )

                response.statusCode = result
                response.end()

                return {result: false, scope: stateAPIScope}
            }

            if (result === 'break')
                break

            if (result === 'continue')
                continue

            if (result)
                useStateAPI = true
            else
                break

            index += 1
        }

        if (useStateAPI) {
            console.info(`Use state api:`, Tools.represent(stateAPI))

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

            console.info(
                `State api response is:`,
                Tools.represent(stateAPIScope[stateAPI.name].response)
            )

            index = 1
            for (const expression of stateAPI.expressions.post) {
                let result:'break'|'continue'|number|true = 'break'
                try {
                    result = expression(
                        stateAPI.data,
                        error,
                        request,
                        response,
                        stateAPIScope,
                        Tools
                    )
                } catch (error) {
                    console.warn(
                        `Failed running ${index}. post expression of state ` +
                        'api:',
                        error
                    )
                }

                if (typeof result === 'number') {
                    console.info(
                        'Break request caused by state api ' +
                        `"${stateAPI.name}" with status code ${result}.`
                    )

                    response.statusCode = result
                    response.end()

                    return {result: false, scope: stateAPIScope}
                }

                if (result === 'break')
                    break

                if (result === 'continue')
                    continue

                index += 1
            }
        }
    }

    return {result: true, scope: stateAPIScope}
}
export const determineForwarder = (
    request:BufferedHTTPServerRequest,
    response:HTTPServerResponse,
    forwarders:ResolvedForwarders
):ResolvedForwarder|null => {
    for (const [name, forwarder] of Object.entries(forwarders))
        if (forwarder.useExpression(
            forwarder,
            null,
            request,
            response,
            {
                [name]: {
                    configuration: forwarder,
                    error: null,
                    response: null
                }
            },
            Tools
        )) {
            console.info(`Determined forwarder "${name}".`)

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
                Tools.modifyObject<ResolvedForwarder>(
                    Tools.copy(forwarders.base) as
                        unknown as
                        ResolvedForwarder,
                    givenForwarder as unknown as ResolvedForwarder
                )!,
                givenForwarder as unknown as ResolvedForwarder
            ) as unknown as ResolvedForwarder
            // region normalize header transformations
            const headerTransformations:ResolvedHeaderTransformations = {
                retrieve: [],
                send: []
            }
            for (const type of ['retrieve', 'send'] as const)
                for (const givenTransformation of (
                    [] as Array<HeaderTransformation>
                ).concat(
                    forwarder.headerTransformations[type] as
                        unknown as
                        HeaderTransformation
                )) {
                    const transformation:ResolvedHeaderTransformation = {
                        ...givenTransformation,
                        sourceRun: ():string => '',
                        targetRun: ():string => ''
                    }

                    if (Object.prototype.hasOwnProperty.call(
                        transformation, 'source'
                    ))
                        if (transformation.source instanceof RegExp)
                            transformation.sourceRun = ():RegExp =>
                                transformation.source as RegExp
                        else if (typeof transformation.source === 'string') {
                            const result:CompilationResult<RegExp|string> =
                                Tools.stringCompile<RegExp|string>(
                                    transformation.source,
                                    EVALUATION_SCOPE_NAMES
                                )

                            if (result.error)
                                throw new Error(result.error)

                            transformation.sourceRun = result.templateFunction
                        } else
                            transformation.sourceRun = transformation.source!

                    if (Object.prototype.hasOwnProperty.call(
                        transformation, 'target'
                    ))
                        if (typeof transformation.target === 'string') {
                            const result:CompilationResult<
                                string|StringReplacer
                            > = Tools.stringCompile<string|StringReplacer>(
                                transformation.target, EVALUATION_SCOPE_NAMES
                            )

                            if (result.error)
                                throw new Error(result.error)

                            transformation.targetRun = result.templateFunction
                        } else
                            transformation.targetRun = transformation.target!

                    headerTransformations[type].push(transformation)
                }
            forwarder.headerTransformations = headerTransformations
            // endregion
            // region state apis
            const stateAPIs:Array<ResolvedStateAPI> = []
            const givenStateAPIs:Array<StateAPI> =
                ([] as Array<StateAPI>).concat(forwarder.stateAPIs || [])
            const baseAPI:StateAPI = givenStateAPIs.filter(
                (api:StateAPI):boolean => api.name === 'base'
            )[0]
            const extendedGivenStateAPIs:Array<StateAPI> = []
            for (const api of givenStateAPIs)
                if (api.name !== 'base')
                    extendedGivenStateAPIs.push(
                        Tools.extend(
                            true,
                            {},
                            Tools.modifyObject<StateAPI>(
                                Tools.copy(baseAPI), api
                            )!,
                            api
                        )
                    )
            for (const api of extendedGivenStateAPIs) {
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
// endregion
export const addParsedContentToRequest = (
    bufferedRequest:BufferedHTTPServerRequest
):void => {
    if (bufferedRequest.headers['content-type'] === 'application/json')
        try {
            const data:string =
                Buffer.concat(bufferedRequest.socket.buffer.data)
                    .toString()
            bufferedRequest.socket.buffer.body =
                data.replace(/^[\s\S]+\s*\n\s*\n\s*([\s\S]+)$/m, '$1')
            bufferedRequest.socket.buffer.content =
                JSON.parse(bufferedRequest.socket.buffer.body) as ParsedContent
        } catch (error) {
            console.warn('Error parsing given request.', bufferedRequest)
        }
}
export const transformHeaders = (
    content:string,
    headerTransformations:Array<ResolvedHeaderTransformation>,
    parameters:EvaluationParameters
):string => {
    for (const transformation of headerTransformations)
        try {
            const source:RegExp|string =
                transformation.sourceRun(...parameters)
            const target:string|StringReplacer =
                transformation.targetRun(...parameters)

            if (!(source instanceof RegExp) && source.trim() === '') {
                if (target.trim() === '')
                    continue

                // Add new header.
                content = content.replace(
                    /(\s*\n)\s*\n\s*/,
                    (
                        substring:string,
                        delimiter:string,
                        ...parameters:Array<unknown>
                    ):string => {
                        const result:string =
                            typeof target === 'string' ?
                                target :
                                target(substring, delimiter, ...parameters)

                        return `${delimiter}${result}${substring}`
                    }
                )
            } else {
                // Search and replace (or remove) header.
                console.info(
                    `Search for "${source as string}" and replace with`,
                    `${Tools.represent(target)}.`
                )

                content = content.replace(source, target as string)
            }
        } catch (error) {
            console.warn(
                'Could not apply header transformation with source ' +
                (transformation.source ?
                    Tools.represent(transformation.source) :
                    '"add"'
                ) +
                ' and target ' +
                (transformation.target ?
                    Tools.represent(transformation.target) :
                    '"remove"'
                ) +
                ':',
                error
            )
        }

    return content
}
export const reverseProxyBufferedRequest = (
    request:BufferedHTTPServerRequest,
    response:HTTPServerResponse,
    forwarder:ResolvedForwarder,
    stateAPIScope:EvaluationScopeStateAPIs
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
        stateAPIScope,
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

            console.info(`Got response header from backend:\n${content}`)

            content = transformHeaders(
                content, forwarder.headerTransformations.retrieve, parameters
            )

            console.info(`Send response header to client:\n${content}`)

            clientSocket.write(content)

            headerProcessed = true
        })
    } else
        serverSocket.pipe(clientSocket)

    serverSocket.on('connect', () => {
        let headerProcessed = false
        for (const buffer of request.socket.buffer.data) {
            if (!headerProcessed) {
                let content:string = buffer.toString()

                console.info(`Got request header from client:\n${content}`)

                if (forwarder.tls)
                    // NOTE: TLS support was introduced in version 1.1.
                    content = content.replace(/HTTP\/1\.0/i, 'HTTP/1.1')

                // Overwrite proxy host with destination one.
                content = content.replace(
                    /(($|\n)host: )[^\n]+/i, `$1${forwarder.host}${portSuffix}`
                )

                content = transformHeaders(
                    content, forwarder.headerTransformations.send, parameters
                )

                console.info(`Send request header to backend:\n${content}`)

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
