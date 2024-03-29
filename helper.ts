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
    APIPostEvaluationResult,
    APIPreEvaluationResult,
    BufferedHTTPServerRequest,
    EvaluationParameters,
    EvaluationScopeStateAPI,
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
    'data', 'error', 'request', 'response', 'stateAPI', 'stateAPIs', 'Tools'
]

const log = async (...parameters:Array<unknown>):Promise<void> =>
    new Promise((resolve:() => void, reject:(error:Error) => void):void => {
        process.stdout.write(
            `${parameters.join(' ')}\n`,
            (error?:Error):void => error ? reject(error) : resolve()
        )
    })
export const logging = {
    log,
    debug: log,
    info: log,
    error: log,
    warn: log
}

// region forwarder
export const applyStateAPIs = async (
    request:BufferedHTTPServerRequest,
    response:HTTPServerResponse,
    forwarder:ResolvedForwarder
):Promise<{result:boolean, scope:EvaluationScopeStateAPIs}> => {
    const stateAPIScope:EvaluationScopeStateAPIs = {}

    let state:EvaluationScopeStateAPI
    for (const stateAPI of forwarder.stateAPIs) {
        state =
            stateAPIScope[stateAPI.name] =
            {
                configuration: stateAPI,
                error: null,
                response: null
            }
        let useStateAPI = false

        let index = 1
        for (const expression of stateAPI.expressions.pre) {
            let result:APIPreEvaluationResult
            try {
                result = expression(
                    stateAPI.data,
                    null,
                    request,
                    response,
                    state,
                    stateAPIScope,
                    Tools
                )
            } catch (error) {
                void logging.warn(
                    `Failed running pre ${index}. expression of state api:`,
                    error
                )
            }

            if (typeof result === 'number') {
                void logging.info(
                    'Break request caused by state api',
                    `"${stateAPI.name}" with status code ${result}.`
                )

                response.statusCode = result
                response.end()

                return {result: false, scope: stateAPIScope}
            }

            if (result === 'break')
                break

            index += 1

            if (typeof result === 'boolean')
                if (result)
                    useStateAPI = true
                else
                    break
        }

        if (useStateAPI) {
            void logging.info(`Use state api: "${stateAPI.name}"`)

            let error:Error|null = null

            if (stateAPI.urlExpression)
                try {
                    stateAPI.url = stateAPI.urlExpression(
                        stateAPI.data,
                        null,
                        request,
                        response,
                        state,
                        stateAPIScope,
                        Tools
                    )
                } catch (error) {
                    void logging.warn(`Failed running url expression:`, error)
                }

            void logging.debug(
                `\nState api configuration is: ${Tools.represent(stateAPI)}`
            )

            try {
                state.response =
                    await fetch(stateAPI.url!, stateAPI.options) as
                        Response & {data:Mapping<unknown>}
            } catch (givenError) {
                error = givenError as Error

                void logging.warn(
                    `Running state api request for "${stateAPI.name}" throws`,
                    'error:',
                    error
                )
            }

            if (
                state.response &&
                state.response.headers.has('content-type') &&
                /application\/json(;.*)?$/.test(
                    state.response.headers.get('content-type')!
                )
            )
                try {
                    state.response.data =
                        await state.response.json() as PlainObject
                } catch (givenError) {
                    error = givenError as Error

                    void logging.warn(
                        'Parsing state api json response for',
                        `"${stateAPI.name}" throws error:`,
                        error
                    )
                }

            void logging.debug(
                `\nState api response is:`, Tools.represent(state.response)
            )

            index = 1
            for (const expression of stateAPI.expressions.post) {
                let result:APIPostEvaluationResult = null
                try {
                    result = expression(
                        stateAPI.data,
                        error,
                        request,
                        response,
                        state,
                        stateAPIScope,
                        Tools
                    )
                } catch (error) {
                    void logging.warn(
                        `Failed running ${index}. post expression of state ` +
                        'api:',
                        error
                    )
                }

                if (typeof result === 'number') {
                    void logging.info(
                        'Break request caused by state api',
                        `"${stateAPI.name}" with status code ${result}.`
                    )

                    response.statusCode = result
                    response.end()

                    return {result: false, scope: stateAPIScope}
                }

                if (result === 'break')
                    break

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
    for (const [name, forwarder] of Object.entries(forwarders)
        .sort(([firstName], [secondName]) =>
            firstName.localeCompare(secondName)
        )
    ) {
        const state:EvaluationScopeStateAPI = {
            configuration: forwarder,
            error: null,
            response: null
        }

        if (forwarder.useExpression(
            forwarder,
            null,
            request,
            response,
            state,
            {[name]: state},
            Tools
        )) {
            void logging.info(`Determined forwarder is: "${name}".`)

            return forwarder
        }
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
                // region normalize url expression
                if (typeof api.urlExpression === 'string') {
                    const result:CompilationResult<string> =
                        Tools.stringCompile<string>(
                            api.urlExpression, EVALUATION_SCOPE_NAMES
                        )

                    if (result.error)
                        throw new Error(result.error)

                    api.urlExpression = result.templateFunction
                }
                // endregion
                // region normalize pre / post expressions
                const expressions:ResolvedAPIExpressions = {pre: [], post: []}

                for (const expression of (
                    [] as Array<APIPreEvaluationExpression>
                ).concat(api.expressions?.pre || []))
                    if (typeof expression === 'string') {
                        const result:CompilationResult<
                            APIPreEvaluationResult
                        > = Tools.stringCompile<APIPreEvaluationResult>(
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
                        const result:CompilationResult<
                            APIPostEvaluationResult
                        > = Tools.stringCompile<APIPostEvaluationResult>(
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
                // endregion
                stateAPIs.push(api as unknown as ResolvedStateAPI)
            }

            forwarder.stateAPIs = stateAPIs
            // endregion
            // region normalize use expression
            if (typeof forwarder.useExpression === 'string') {
                const result:CompilationResult<boolean> = Tools.stringCompile(
                    forwarder.useExpression, EVALUATION_SCOPE_NAMES
                )

                if (result.error)
                    throw new Error(result.error)

                forwarder.useExpression = result.templateFunction
            }
            // endregion
            resolvedForwarders[name] = forwarder
        }

    return resolvedForwarders
}
// endregion
export const addParsedContentToRequest = (
    bufferedRequest:BufferedHTTPServerRequest
):void => {
    if (
        bufferedRequest.headers['content-type'] &&
        /application\/json(;.*)?$/.test(
            bufferedRequest.headers['content-type']
        )
    )
        try {
            const data:string =
                Buffer.concat(bufferedRequest.socket.buffer.data)
                    .toString()
            bufferedRequest.socket.buffer.body =
                data.replace(/^[\s\S]+\s*\n\s*\n\s*([\s\S]+)$/m, '$1')
            bufferedRequest.socket.buffer.content =
                JSON.parse(bufferedRequest.socket.buffer.body) as ParsedContent
        } catch (error) {
            void logging.warn('Error parsing given request.', bufferedRequest)
        }
}
export const transformHeaders = (
    content:string,
    headerTransformations:Array<ResolvedHeaderTransformation>,
    parameters:EvaluationParameters
):string => {
    let newLinePrinted = false
    for (const transformation of headerTransformations)
        try {
            const source:null|RegExp|string|undefined =
                transformation.sourceRun(...parameters)
            const target:null|string|StringReplacer|undefined =
                transformation.targetRun(...parameters)

            if (
                [null, undefined].includes(source as null) ||
                typeof source === 'string' &&
                source.trim() === ''
            ) {
                if (
                    [null, undefined].includes(target as null) ||
                    typeof target === 'string' &&
                    target.trim() === ''
                )
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
                                target!(substring, delimiter, ...parameters)

                        return `${delimiter}${result}${substring}`
                    }
                )
            } else {
                if (!newLinePrinted) {
                    void logging.debug()
                    newLinePrinted = true
                }
                // Search and replace (or remove) header.
                void logging.debug(
                    `Search for "${source as string}" and replace with`,
                    `${Tools.represent(target)}.`
                )

                content = content.replace(source!, target as string)
            }
        } catch (error) {
            void logging.warn(
                '\nCould not apply header transformation with source ' +
                (transformation.source ?
                    Tools.represent(transformation.source) :
                    '"add"'
                ) +
                ' and replacement ' +
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
export const reverseProxyBufferedRequest = async (
    request:BufferedHTTPServerRequest,
    response:HTTPServerResponse,
    forwarder:ResolvedForwarder,
    stateAPIScope:EvaluationScopeStateAPIs
):Promise<void> =>
    new Promise((resolve:() => void, reject:(error:Error) => void):void => {
        const clientSocket:Socket = response.socket
        const createConnection:typeof createSecureConnection = forwarder.tls ?
            createSecureConnection :
            createPlainConnection as unknown as typeof createSecureConnection
        const portSuffix:string = (
            forwarder.tls && forwarder.port !== 443 ||
            !forwarder.tls && forwarder.port !== 80
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
                void logging.info(
                    `\nConnection to: http${forwarder.tls ? 's' : ''}://` +
                    `${forwarder.host}${portSuffix} established.`
                )
            }
        )
        serverSocket.on('error', (error:Error) => {
            void logging.error('Proxy to server error', error)

            reject(error)
        })

        const parameters:EvaluationParameters = [
            {clientSocket, serverSocket},
            null,
            request,
            response,
            null,
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

                void logging.info(
                    `\n <=== Got response header from backend:\n\n${content}`
                )

                content = transformHeaders(
                    content,
                    forwarder.headerTransformations.retrieve,
                    parameters
                )

                void logging.info(
                    `\n <<<< Send response header to client:\n\n${content}`
                )

                clientSocket.write(content)

                headerProcessed = true

                resolve()
            })
        } else
            serverSocket.pipe(clientSocket)

        serverSocket.on('connect', () => {
            let headerProcessed = false
            for (const buffer of request.socket.buffer.data) {
                if (!headerProcessed) {
                    let content:string = buffer.toString()

                    void logging.debug(
                        `\n ===> Got request header from client:\n\n${content}`
                    )

                    if (forwarder.tls)
                        // NOTE: TLS support was introduced in version 1.1.
                        content = content.replace(/HTTP\/1\.0/i, 'HTTP/1.1')

                    // Overwrite proxy host with destination one.
                    content = content.replace(
                        /(($|\n)host: )[^\n]+/i,
                        `$1${forwarder.host}${portSuffix}`
                    )

                    content = transformHeaders(
                        content,
                        forwarder.headerTransformations.send,
                        parameters
                    )

                    void logging.debug(
                        `\n >>>> Send request header to backend:\n\n${content}`
                    )

                    serverSocket.write(content)

                    headerProcessed = true
                    continue
                }

                serverSocket.write(buffer)
            }
        })
    })

export default reverseProxyBufferedRequest
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
