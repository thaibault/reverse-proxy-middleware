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
import {
    CompilationResult,
    compile,
    copy,
    extend,
    Mapping,
    modifyObject,
    PlainObject,
    represent,
    UTILITY_SCOPE_NAMES,
    UTILITY_SCOPE_VALUES
} from 'clientnode'
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
export const EVALUATION_SCOPE_NAMES = [
    ...UTILITY_SCOPE_NAMES,
    'data',
    'error',
    'request',
    'response',
    'stateAPI',
    'stateAPIs'
] as const

const log = async (...parameters:Array<unknown>):Promise<void> =>
    new Promise((resolve:() => void, reject:(error:Error) => void):void => {
        process.stdout.write(
            `${parameters.join(' ')}\n`,
            (error?:unknown) => {
                if (error)
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject(error as Error)
                else
                    resolve()
            }
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
                    ...UTILITY_SCOPE_VALUES,
                    stateAPI.data,
                    null,
                    request,
                    response,
                    state,
                    stateAPIScope
                )
            } catch (error) {
                void logging.warn(
                    `Failed running pre ${String(index)}. expression of ` +
                    'state api:',
                    error
                )
            }

            if (typeof result === 'number') {
                void logging.info(
                    'Break request caused by state api',
                    `"${stateAPI.name}" with status code ${String(result)}.`
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
                        ...UTILITY_SCOPE_VALUES,
                        stateAPI.data,
                        null,
                        request,
                        response,
                        state,
                        stateAPIScope
                    )
                } catch (error) {
                    void logging.warn(`Failed running url expression:`, error)
                }

            void logging.debug(
                `\nState api configuration is: ${represent(stateAPI)}`
            )

            try {
                // @ts-expect-error "stateAPI.url" may not be defined.
                state.response = await fetch(stateAPI.url, stateAPI.options) as
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
                    state.response.headers.get('content-type') as string
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
                `\nState api response is:`, represent(state.response)
            )

            index = 1
            for (const expression of stateAPI.expressions.post) {
                let result:APIPostEvaluationResult = null
                try {
                    result = expression(
                        ...UTILITY_SCOPE_VALUES,
                        stateAPI.data,
                        error,
                        request,
                        response,
                        state,
                        stateAPIScope
                    )
                } catch (error) {
                    void logging.warn(
                        `Failed running ${String(index)}. post ` +
                        'expression of state api:',
                        error
                    )
                }

                if (typeof result === 'number') {
                    void logging.info(
                        'Break request caused by state api',
                        `"${stateAPI.name}" with status code ` +
                        `${String(result)}.`
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
            ...UTILITY_SCOPE_VALUES,
            forwarder,
            null,
            request,
            response,
            state,
            {[name]: state}
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
            const forwarder = extend(
                true,
                {name},
                modifyObject<ResolvedForwarder>(
                    copy(forwarders.base) as unknown as ResolvedForwarder,
                    givenForwarder as unknown as ResolvedForwarder
                ),
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
                                compile<RegExp|string>(
                                    transformation.source,
                                    EVALUATION_SCOPE_NAMES as
                                        unknown as
                                        Array<string>
                                )

                            if (result.error)
                                throw new Error(result.error)

                            transformation.sourceRun = result.templateFunction
                        } else if (transformation.source)
                            transformation.sourceRun = transformation.source

                    if (Object.prototype.hasOwnProperty.call(
                        transformation, 'target'
                    ))
                        if (typeof transformation.target === 'string') {
                            const result:CompilationResult<
                                string|StringReplacer
                            > = compile<string|StringReplacer>(
                                transformation.target,
                                EVALUATION_SCOPE_NAMES as
                                    unknown as
                                    Array<string>
                            )

                            if (result.error)
                                throw new Error(result.error)

                            transformation.targetRun = result.templateFunction
                        } else if (transformation.target)
                            transformation.targetRun = transformation.target

                    headerTransformations[type].push(transformation)
                }
            forwarder.headerTransformations = headerTransformations
            // endregion
            // region state apis
            const stateAPIs:Array<ResolvedStateAPI> = []
            const givenStateAPIs:Array<StateAPI> = ([] as Array<StateAPI>)
                .concat(
                    (forwarder as Partial<ResolvedForwarder>).stateAPIs || []
                )
            const baseAPI:StateAPI = givenStateAPIs.filter(
                (api:StateAPI):boolean => api.name === 'base'
            )[0]

            const extendedGivenStateAPIs:Array<StateAPI> = []
            for (const api of givenStateAPIs)
                if (api.name !== 'base')
                    extendedGivenStateAPIs.push(
                        extend(
                            true,
                            {},
                            modifyObject<StateAPI>(copy(baseAPI), api),
                            api
                        )
                    )

            for (const api of extendedGivenStateAPIs) {
                // region normalize url expression
                if (typeof api.urlExpression === 'string') {
                    const result:CompilationResult =
                        compile(
                            api.urlExpression,
                            EVALUATION_SCOPE_NAMES as unknown as Array<string>
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
                        > = compile<APIPreEvaluationResult>(
                            expression,
                            EVALUATION_SCOPE_NAMES as
                                unknown as
                                Array<string>
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
                        > = compile<APIPostEvaluationResult>(
                            expression,
                            EVALUATION_SCOPE_NAMES as
                                unknown as
                                Array<string>
                        )

                        if (result.error)
                            throw new Error(result.error)

                        expressions.post.push(result.templateFunction)
                    } else
                        expressions.post.push(expression)

                ;(api as unknown as ResolvedStateAPI).expressions = expressions
                // endregion
                stateAPIs.push(api as unknown as ResolvedStateAPI)
            }

            forwarder.stateAPIs = stateAPIs
            // endregion
            // region normalize use expression
            if (typeof forwarder.useExpression === 'string') {
                const result:CompilationResult<boolean> = compile(
                    forwarder.useExpression,
                    EVALUATION_SCOPE_NAMES as
                        unknown as
                        Array<string>
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
        } catch (_error) {
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
                                target ?
                                    target(
                                        substring, delimiter, ...parameters
                                    ) :
                                    ''

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
                    `${represent(target)}.`
                )

                if (source)
                    content = content.replace(source, target as string)
            }
        } catch (error) {
            void logging.warn(
                '\nCould not apply header transformation with source ' +
                (transformation.source ?
                    represent(transformation.source) :
                    '"add"'
                ) +
                ' and replacement ' +
                (transformation.target ?
                    represent(transformation.target) :
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
            ...UTILITY_SCOPE_VALUES,
            {clientSocket, serverSocket},
            null,
            request,
            response,
            null,
            stateAPIScope
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
