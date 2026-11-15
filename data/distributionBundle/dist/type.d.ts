import type { Level, Mapping, PlainObject, Primitive, UTILITY_SCOPE, UTILITY_SCOPE_VALUES } from 'clientnode';
import type { Http2SecureServer as HTTPSecureServer, Http2Server as HttpServer, Http2ServerRequest, Http2ServerResponse, Http2Stream, OutgoingHttpHeaders } from 'http2';
import type { ServerOptions as SecureServerOptions } from 'https';
import type { Socket as PlainSocket } from 'net';
import type { TLSSocket } from 'tls';
export type HTTPServer = HttpServer | HTTPSecureServer;
export type HTTPServerRequest = Http2ServerRequest;
export type HTTPServerResponse = Http2ServerResponse;
export type HTTPStream = Http2Stream;
export type OutgoingHTTPHeaders = OutgoingHttpHeaders;
export type Socket = PlainSocket | TLSSocket;
export type ParsedContent = Array<PlainObject | Primitive> | PlainObject;
export type BufferedSocket = Socket & {
    buffer: {
        body?: string;
        content?: ParsedContent;
        data: Array<Buffer>;
        finished: boolean;
    };
};
export interface BufferedHTTPServerRequest extends HTTPServerRequest {
    socket: BufferedSocket;
}
export type StringReplacer = (substring: string, ...parameters: Array<unknown>) => string;
export interface EvaluationScopeStateAPI {
    configuration: ResolvedForwarder | ResolvedStateAPI;
    error: Error | null;
    response: (Response & {
        data: Mapping<unknown>;
    }) | null;
}
export type EvaluationScopeStateAPIs = Mapping<EvaluationScopeStateAPI>;
export type EvaluationScope = typeof UTILITY_SCOPE & {
    data?: Mapping<unknown>;
    error?: Error | null;
    request?: HTTPServerRequest;
    response?: HTTPServerResponse;
    stateAPI?: EvaluationScopeStateAPI | null;
    stateAPIs?: EvaluationScopeStateAPIs;
};
export type EvaluationParameters = [
    ...typeof UTILITY_SCOPE_VALUES,
    EvaluationScope['data'],
    EvaluationScope['error'],
    EvaluationScope['request'],
    EvaluationScope['response'],
    EvaluationScope['stateAPI'],
    EvaluationScope['stateAPIs']
];
export type APIPreEvaluationResult = 'break' | boolean | null | number | undefined;
export type APIPreEvaluationExpression = string | ((...parameters: EvaluationParameters) => APIPreEvaluationResult);
export type APIPostEvaluationResult = 'break' | null | number | undefined;
export type APIPostEvaluationExpression = string | ((...parameters: EvaluationParameters) => APIPostEvaluationResult);
export interface APIExpressions {
    pre?: Array<APIPreEvaluationExpression> | APIPreEvaluationExpression;
    post?: Array<APIPostEvaluationExpression> | APIPostEvaluationExpression;
}
export interface StateAPI {
    data?: Mapping<unknown>;
    name: string;
    options?: RequestInit;
    expressions?: APIExpressions;
    url?: string;
    urlExpression?: string | ((...parameters: EvaluationParameters) => string);
}
export interface ResolvedAPIExpressions {
    pre: Array<(...parameters: EvaluationParameters) => APIPreEvaluationResult>;
    post: Array<(...parameters: EvaluationParameters) => APIPostEvaluationResult>;
}
export type ResolvedStateAPI = NonNullable<Omit<StateAPI, 'expressions' | 'urlExpression'>> & {
    expressions: ResolvedAPIExpressions;
    urlExpression?: (...parameters: EvaluationParameters) => string;
};
export interface HeaderTransformation {
    source?: (string | RegExp | ((...parameters: EvaluationParameters) => RegExp | string));
    target?: (string | ((...parameters: EvaluationParameters) => string | ((substring: string, ...parameters: Array<unknown>) => string)));
}
export interface ResolvedHeaderTransformation extends HeaderTransformation {
    sourceRun: (...parameters: EvaluationParameters) => null | RegExp | string | undefined;
    targetRun: (...parameters: EvaluationParameters) => null | string | StringReplacer | undefined;
}
export interface HeaderTransformations {
    retrieve?: Array<HeaderTransformation> | HeaderTransformation;
    send?: Array<HeaderTransformation> | HeaderTransformation;
}
export interface ResolvedHeaderTransformations {
    retrieve: Array<ResolvedHeaderTransformation>;
    send: Array<ResolvedHeaderTransformation>;
}
export interface Forwarder {
    headerTransformations?: HeaderTransformations;
    host: string;
    port?: number;
    rejectUnauthorized?: boolean;
    stateAPIs?: Array<StateAPI> | StateAPI;
    tls?: boolean;
    useExpression?: string | ((...parameters: EvaluationParameters) => boolean);
}
export interface Forwarders {
    base: Forwarder;
    [key: string]: Partial<Forwarder>;
}
export type ResolvedForwarder = NonNullable<Omit<Forwarder, 'headerTransformations' | 'stateAPIs' | 'useExpression'>> & {
    headerTransformations: ResolvedHeaderTransformations;
    name: string;
    stateAPIs: Array<ResolvedStateAPI>;
    useExpression: (...parameters: EvaluationParameters) => boolean;
};
export type ResolvedForwarders = Mapping<ResolvedForwarder>;
export interface Configuration {
    logLevel: Level;
    privateKeyPath: string;
    publicKeyPath: string;
    nodeServerOptions: SecureServerOptions;
    host: string;
    port: number;
    parseBody: boolean;
    forwarders: Forwarders;
}
export type ResolvedConfiguration = Omit<Configuration, 'forwarders'> & {
    forwarders: ResolvedForwarders;
};
export interface Server {
    instance: HTTPServer;
    streams: Array<HTTPStream>;
    sockets: Array<Socket>;
    start: () => Promise<void>;
    stop: () => Promise<void>;
}
