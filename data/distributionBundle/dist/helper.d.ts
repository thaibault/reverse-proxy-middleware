import type { BufferedHTTPServerRequest, Configuration, EvaluationParameters, EvaluationScopeStateAPIs, Forwarders, HTTPServerResponse, ResolvedHeaderTransformation, ResolvedForwarder, ResolvedForwarders, Server } from './type';
import { Logger } from 'clientnode';
export declare const EVALUATION_SCOPE_NAMES: readonly ["array", "datetime", "filesystem", "functions", "indicators", "logger", "module", "number", "object", "string", "utility", "data", "error", "request", "response", "stateAPI", "stateAPIs"];
export declare const log: Logger;
export declare const applyStateAPIs: (request: BufferedHTTPServerRequest, response: HTTPServerResponse, forwarder: ResolvedForwarder) => Promise<{
    result: boolean;
    scope: EvaluationScopeStateAPIs;
}>;
export declare const determineForwarder: (request: BufferedHTTPServerRequest, response: HTTPServerResponse, forwarders: ResolvedForwarders) => null | ResolvedForwarder;
export declare const resolveForwarders: (forwarders: Forwarders) => ResolvedForwarders;
export declare const addParsedContentToRequest: (bufferedRequest: BufferedHTTPServerRequest) => void;
export declare const transformHeaders: (content: string, headerTransformations: Array<ResolvedHeaderTransformation>, parameters: EvaluationParameters) => string;
export declare const reverseProxyBufferedRequest: (request: BufferedHTTPServerRequest, response: HTTPServerResponse, forwarder: ResolvedForwarder, stateAPIScope: EvaluationScopeStateAPIs) => Promise<void>;
/**
 * Loads the package configuration extended by "configuration.json" and
 * "secure-configuration.json" files found in given directory, evaluates all
 * dynamic values and loads configured key and certificate files into the node
 * server options.
 * @param directoryPath - Directory to search configuration files in.
 * @param baseConfiguration - Configuration to extend.
 * @returns A promise resolving to the evaluated configuration.
 */
export declare const loadConfiguration: (directoryPath?: string, baseConfiguration?: Configuration) => Promise<Configuration>;
/**
 * Waits until given request is fully buffered, determines its forwarder,
 * applies the forwarder's state apis and forwards the request.
 * @param request - Buffered client request.
 * @param response - Response to the client.
 * @param forwarders - Forwarders to choose from.
 * @param parseBody - Indicates whether to parse a json request body.
 * @returns A promise resolving when the request has been processed.
 */
export declare const handleRequest: (request: BufferedHTTPServerRequest, response: HTTPServerResponse, forwarders: ResolvedForwarders, parseBody?: boolean) => Promise<void>;
/**
 * Creates a (not yet listening) server forwarding incoming requests.
 * @param configuration - Server configuration.
 * @param forwarders - Forwarders to use for incoming requests.
 * @returns The created server.
 */
export declare const createServer: (configuration: Configuration, forwarders?: ResolvedForwarders) => Server;
export default reverseProxyBufferedRequest;
