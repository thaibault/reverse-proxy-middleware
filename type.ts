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
import {Mapping, TemplateFunction} from 'clientnode/type'
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

export interface EvaluationScope {
    error?:Error
    request?:HTTPServerRequest
    response?:HTTPServerResponse
    stateAPIs?:Mapping<{
        error?:Error
        configuration:StateAPI
        response?:HTTPServerResponse
    }>
    Tools:typeof Tools
}

export interface APIExpressions {
    post?:Array<string>|string
    pre?:Array<string>|string
}
export interface StateAPI {
    data?:Mapping<unknown>
    name:string
    options?:RequestInit
    expressions?:APIExpressions
    skipSecrets?:Array<string>|string
    url:string
}
export interface ResolvedAPIExpressions {
    pre:Array<TemplateFunction<boolean|number>>
    post:Array<TemplateFunction<number|true>>
}
export type ResolvedStateAPI =
    NonNullable<Omit<StateAPI, 'expressions'|'skipSecrets'>> &
    {
        expressions:ResolvedAPIExpressions
        skipSecrets:Array<string>
    }
export interface HeaderTransformation {
    source?:string|RegExp
    target?:string|((substring:string, ...parameters:Array<unknown>) => string)
}
export interface ResolvedHeaderTransformation {
    source:TemplateFunction<RegExp|string>
    target:TemplateFunction<string|StringReplacer>
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
    useExpression?:string
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
        stateAPIs:Array<ResolvedStateAPI>
        useExpression:TemplateFunction<boolean>
    }
export type ResolvedForwarders = {
    [key:string]:ResolvedForwarder
}

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
