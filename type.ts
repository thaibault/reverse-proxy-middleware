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
import {Mapping} from 'clientnode/type'
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
export type BufferedSocket = Socket & {buffers:Array<Buffer>}
export interface BufferedHTTPServerRequest extends HTTPServerRequest {
    socket:BufferedSocket
}

export type StringReplacer =
    (substring:string, ...parameters:Array<unknown>) => string

export type EvaluationScopeStateAPIs = Mapping<{
    configuration:ResolvedForwarders|ResolvedStateAPI
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

export type APIPreEvaluationExpression = (
    string |
    ((...parameters:EvaluationParameters) => 'break'|boolean|'continue'|number)
)
export type APIPostEvaluationExpression = (
    string |
    ((...parameters:EvaluationParameters) => 'break'|'continue'|number|true)
)
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
        (...parameters:EvaluationParameters) =>
            'break'|number|'continue'|true
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
export interface ResolvedHeaderTransformation {
    source:(...parameters:EvaluationParameters) => RegExp|string
    target:(...parameters:EvaluationParameters) => string|StringReplacer
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
