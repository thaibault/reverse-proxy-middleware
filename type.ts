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
import {
    Http2SecureServer as HTTPSecureServer,
    Http2Server as HttpServer,
    Http2ServerRequest as HTTPServerRequest,
    Http2Stream as HTTPStream,
    SecureServerOptions
} from 'http2'
import {Socket as PlainSocket} from 'net'
import {TLSSocket} from 'tls'
// endregion
export interface APIConfiguration {
    headerName:string
    identifiyAsHumanIfServiceThrowsException:boolean
    secret:string
    score:number
    options:RequestInit
    url:string
}
export type APIConfigurations = {
    base:APIConfiguration
    [key:string]:Partial<APIConfiguration>
}
export type ResolvedAPIConfigurations = {
    [key:string]:APIConfiguration
}

export type Socket = PlainSocket|TLSSocket
export type BufferedSocket = Socket & {buffers:Array<Buffer>}
export interface BufferedHTTPServerRequest extends HTTPServerRequest {
    socket:BufferedSocket
}

export interface HeaderTransformation {
    source:string|RegExp
    target:string|((substring:string, ...parameters:Array<unknown>) => string)
}
export interface Configuration {
    publicKeyPath:string
    privateKeyPath:string

    nodeServerOptions:SecureServerOptions
    host:string
    port:number

    forward:{
        headerTransformation:{
            retrieve:Array<HeaderTransformation>
            send:Array<HeaderTransformation>
        }
        host:string
        port:number
        tls:boolean
    }

    humanChecker:{
        applicationInterfaces:APIConfigurations
        botDetectionStatusCode:number
        skipSecrets:Array<string>
    }
}

export type HTTPServer = HttpServer|HTTPSecureServer
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