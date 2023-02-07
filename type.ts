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
import Tools from 'clientnode'
import {Mapping, PlainObject, Primitive} from 'clientnode/type'
import {
    Http2SecureServer as HTTPSecureServer,
    Http2Server as HttpServer,
    Http2ServerRequest,
    Http2ServerResponse,
    Http2Stream,
    OutgoingHttpHeaders,
    SecureServerOptions
} from 'http2'
import {Socket as PlainSocket} from 'net'
import {TLSSocket} from 'tls'
// endregion
export type HTTPServer = HttpServer|HTTPSecureServer
export type HTTPServerRequest = Http2ServerRequest
export type HTTPServerResponse = Http2ServerResponse
export type HTTPStream = Http2Stream

export type OutgoingHTTPHeaders = OutgoingHttpHeaders

export type Socket = PlainSocket|TLSSocket
export type ParsedContent = Array<PlainObject|Primitive>|PlainObject
export type BufferedSocket =
    Socket &
    {
        buffer:{
            body?:string
            content?:ParsedContent
            data:Array<Buffer>
            finished:boolean
        }
    }
export interface BufferedHTTPServerRequest extends HTTPServerRequest {
    socket:BufferedSocket
}

export type StringReplacer =
    (substring:string, ...parameters:Array<unknown>) => string

export type EvaluationScopeStateAPIs = Mapping<{
    configuration:ResolvedForwarder|ResolvedStateAPI
    error:Error|null
    response:(Response & {data:Mapping<unknown>})|null
}>
export interface EvaluationScope {
    data?:Mapping<unknown>
    error?:Error|null
    request?:HTTPServerRequest
    response?:HTTPServerResponse
    stateAPIs?:EvaluationScopeStateAPIs
    Tools:typeof Tools
}
export type EvaluationParameters = [
    EvaluationScope['data'],
    EvaluationScope['error'],
    EvaluationScope['request'],
    EvaluationScope['response'],
    EvaluationScope['stateAPIs'],
    EvaluationScope['Tools']
]

/**
 * break (string)    -> Do not evaluate subsequent pre evaluations.
 * null or undefined -> Just jump to the next evaluation to run.
 * true (boolean)    -> Use this state api configuration. Run the configured
 *                      request.
 * false (boolean)   -> Do not use this state api and to not run subsequent pre
 *                      evaluations.
 * code (number)     -> Answer client request with provided http status code
 *                      and do not run any subsequent pre-evaluations,
 *                      state-api request or request forwarding to the
 *                      underlying backend.
 */
export type APIPreEvaluationResult = 'break'|boolean|null|number|undefined|void
export type APIPreEvaluationExpression =
    string|((...parameters:EvaluationParameters) => APIPreEvaluationResult)
/**
 * break (string)    -> Do not evaluate subsequent post evaluations.
 * null or undefined -> Just jump to the next evaluation to run.
 * code (number)     -> Answer client request with provided http status code
 *                      and do not run any subsequent pre-evaluations,
 *                      state-api request or request forwarding to the
 *                      underlying backend.
 */
export type APIPostEvaluationResult = 'break'|null|number|void
export type APIPostEvaluationExpression =
    string|((...parameters:EvaluationParameters) => APIPostEvaluationResult)
export interface APIExpressions {
    pre?:Array<APIPreEvaluationExpression>|APIPreEvaluationExpression
    post?:Array<APIPostEvaluationExpression>|APIPostEvaluationExpression
}
export interface StateAPI {
    data?:Mapping<unknown>
    name:string
    options?:RequestInit
    expressions?:APIExpressions
    url:string
}
export interface ResolvedAPIExpressions {
    pre:Array<
        (...parmaters:EvaluationParameters) =>
            'break'|boolean|'continue'|number
    >
    post:Array<
        (...parameters:EvaluationParameters) => 'break'|number|'continue'|true
    >
}
export type ResolvedStateAPI =
    NonNullable<Omit<StateAPI, 'expressions'>> &
    {expressions:ResolvedAPIExpressions}
export interface HeaderTransformation {
    source?:(
        string |
        RegExp |
        ((...parameters:EvaluationParameters) => RegExp|string)
    )
    target?:(
        string |
        ((...parameters:EvaluationParameters) =>
            string|((substring:string, ...parameters:Array<unknown>) => string)
        )
    )
}
export interface ResolvedHeaderTransformation extends HeaderTransformation {
    sourceRun:(...parameters:EvaluationParameters) =>
        null|RegExp|string|undefined
    targetRun:(...parameters:EvaluationParameters) =>
        null|string|StringReplacer|undefined
}
export interface HeaderTransformations {
    retrieve?:Array<HeaderTransformation>|HeaderTransformation
    send?:Array<HeaderTransformation>|HeaderTransformation
}
export interface ResolvedHeaderTransformations {
    retrieve:Array<ResolvedHeaderTransformation>
    send:Array<ResolvedHeaderTransformation>
}
export interface Forwarder {
    headerTransformations?:HeaderTransformations
    host:string
    port?:number
    stateAPIs?:StateAPI|Array<StateAPI>
    tls?:boolean
    useExpression?:string|((...parameters:EvaluationParameters) => boolean)
}
export interface Forwarders {
    base:Forwarder
    [key:string]:Partial<Forwarder>
}
export type ResolvedForwarder =
    NonNullable<Omit<
        Forwarder, 'headerTransformations'|'stateAPIs'|'useExpression'
    >> &
    {
        headerTransformations:ResolvedHeaderTransformations
        name:string
        stateAPIs:Array<ResolvedStateAPI>
        useExpression:(...parameters:EvaluationParameters) => boolean
    }
export type ResolvedForwarders = Mapping<ResolvedForwarder>

export interface Configuration {
    privateKeyPath:string
    publicKeyPath:string

    nodeServerOptions:SecureServerOptions
    host:string
    port:number

    parseBody:boolean
    forwarders:Forwarders
}
export type ResolvedConfiguration =
    Omit<Configuration, 'forwarders'> & {forwarders:ResolvedForwarders}

export interface Server {
    instance:HTTPServer
    streams:Array<HTTPStream>
    sockets:Array<Socket>

    start:() => void
    stop:() => void
}
// region vim modline
// vim: set tabstop=4 shiftwidth=4 expandtab:
// vim: foldmethod=marker foldmarker=region,endregion:
// endregion
