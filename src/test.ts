// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/
// region imports
import type {
    APIPreEvaluationResult,
    BufferedHTTPServerRequest,
    Configuration,
    EvaluationParameters,
    Forwarders,
    HTTPServerResponse,
    ResolvedForwarder,
    ResolvedHeaderTransformation
} from './type'

import {copy, importFilesystemAPI, UTILITY_SCOPE_VALUES} from 'clientnode'
import {testEach} from 'clientnode/test-helper'
import {mkdtemp, readFile, rm, writeFile} from 'fs/promises'
import {createServer as createHTTPServer} from 'http'
import {
    AddressInfo,
    connect,
    createServer as createNetServer,
    Server as NetServer,
    Socket
} from 'net'
import {tmpdir} from 'os'
import {join, resolve as resolvePath} from 'path'
import {PassThrough} from 'stream'
import {
    connect as connectSecure,
    createServer as createSecureNetServer,
    Server as SecureNetServer
} from 'tls'

import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals'

import packageConfiguration from '../package.json'

import reverseProxyBufferedRequest, {
    addParsedContentToRequest,
    applyStateAPIs,
    createServer,
    determineForwarder,
    handleRequest,
    loadConfiguration,
    log,
    resolveForwarders,
    transformHeaders
} from './helper'
// endregion
const {configuration: BASE_CONFIGURATION} = packageConfiguration

const positiveUseExpression = () => true

log.level = 'error'
// region mocks
const createRequest = (
    data: Array<string> = [], headers: Record<string, string> = {}
): BufferedHTTPServerRequest => ({
    headers,
    socket: {
        buffer: {data: data.map((item) => Buffer.from(item)), finished: true}
    }
}) as unknown as BufferedHTTPServerRequest
const createResponse = (
    socket: PassThrough = new PassThrough()
): HTTPServerResponse & {endMock: ReturnType<typeof jest.fn>} => {
    const endMock = jest.fn()

    return {
        end: endMock, endMock, socket, statusCode: 200
    } as unknown as HTTPServerResponse & {endMock: ReturnType<typeof jest.fn>}
}
const createForwarder = (
    forwarder: Forwarders[string] & Record<string, unknown>
): ResolvedForwarder => resolveForwarders({
    base: {...BASE_CONFIGURATION.forwarders.base, stateAPIs: []},
    test: forwarder
}).test
/*
    NOTE: "localhost" may resolve to an ipv6 address servers listen on while
    clients connect via ipv4 (e.g. in "node:lts" containers).
*/
const HOST = '127.0.0.1'
const PARAMETERS = [
    ...UTILITY_SCOPE_VALUES, null, null, null, null, null, {}
] as unknown as EvaluationParameters
// NOTE: Self-signed certificate for "localhost" with its private key.
const CERTIFICATE_PATH = resolvePath('test/certificate.pem')
const PRIVATE_KEY_PATH = resolvePath('test/key.pem')
const getClosedPort = async (): Promise<number> => {
    const server = createNetServer()
    await new Promise<void>((resolve): void => {
        server.listen(0, HOST, resolve)
    })
    const {port} = server.address() as AddressInfo
    await new Promise((resolve): void => {
        server.close(resolve)
    })

    return port
}
// endregion
describe('helper', (): void => {
    /*
        NOTE: Errors raised by node's socket implementation are created in
        another realm, so "expect.any(Error)" can not match them.
    */
    const ANY_ERROR = expect.objectContaining({
        name: expect.stringMatching(/Error$/)
    }) as unknown as Error
    // NOTE: Expected error logs are asserted in the tests producing them.
    const logErrorSpy = jest.spyOn(log, 'error')

    beforeEach((): void => {
        logErrorSpy.mockResolvedValue(undefined)
    })
    afterEach((): void => {
        logErrorSpy.mockReset()
    })
    afterAll((): void => {
        logErrorSpy.mockRestore()
    })

    // region resolveForwarders
    testEach(
        'resolveForwarders',
        resolveForwarders,

        [{}, BASE_CONFIGURATION.forwarders],
        [
            {
                test: {
                    headerTransformations: {
                        retrieve: [],
                        send: []
                    },
                    host: 'host',
                    name: 'test',
                    port: 443,
                    rejectUnauthorized: false,
                    stateAPIs: [],
                    tls: true,
                    useExpression: positiveUseExpression
                }
            },
            {
                base: BASE_CONFIGURATION.forwarders.base,
                test: {host: 'host', useExpression: positiveUseExpression}
            }
        ]
    )
    test('resolveForwarders compiles expressions', (): void => {
        const sourceFunction = () => 'a'
        const targetFunction = () => 'b'
        const forwarder = createForwarder({
            headerTransformations: {
                retrieve: {source: /x/, target: targetFunction},
                send: [
                    {source: '"a" + "b"', target: '`c${1 + 1}`'},
                    {source: sourceFunction},
                    {}
                ]
            },
            stateAPIs: [
                {
                    expressions: {post: ['null'], pre: 'true'},
                    name: 'base',
                    url: 'http://base'
                },
                {
                    expressions: {
                        post: [() => null], pre: [() => true]
                    },
                    name: 'custom',
                    urlExpression: '"http://" + data.host',
                    data: {host: 'custom'}
                }
            ],
            useExpression: 'request === null'
        })

        expect(forwarder.headerTransformations.retrieve).toHaveLength(1)
        expect(forwarder.headerTransformations.retrieve[0].sourceRun(
            ...PARAMETERS
        )).toStrictEqual(/x/)
        expect(forwarder.headerTransformations.retrieve[0].targetRun)
            .toStrictEqual(targetFunction)

        const [compiled, functional, empty] =
            forwarder.headerTransformations.send
        expect(compiled.sourceRun(...PARAMETERS)).toStrictEqual('ab')
        expect(compiled.targetRun(...PARAMETERS)).toStrictEqual('c2')
        expect(functional.sourceRun).toStrictEqual(sourceFunction)
        expect(functional.targetRun(...PARAMETERS)).toStrictEqual('')
        expect(empty.sourceRun(...PARAMETERS)).toStrictEqual('')

        // NOTE: The base state api is only used as template.
        expect(forwarder.stateAPIs).toHaveLength(1)
        const [stateAPI] = forwarder.stateAPIs
        expect(stateAPI.name).toStrictEqual('custom')
        expect(stateAPI.url).toStrictEqual('http://base')
        // NOTE: Given expression lists replace the base ones.
        expect(stateAPI.expressions.pre).toHaveLength(1)
        expect(stateAPI.expressions.pre[0](...PARAMETERS)).toStrictEqual(true)
        expect(stateAPI.expressions.post).toHaveLength(1)
        expect(stateAPI.urlExpression?.(...[
            ...UTILITY_SCOPE_VALUES,
            {host: 'custom'}, null, null, null, null, {}
        ] as unknown as EvaluationParameters)).toStrictEqual('http://custom')

        expect(forwarder.useExpression(...PARAMETERS)).toStrictEqual(true)
    })
    test.each([
        {headerTransformations: {send: {source: '+'}}},
        {headerTransformations: {send: {target: '+'}}},
        {stateAPIs: {name: 'test', urlExpression: '+'}},
        {stateAPIs: {expressions: {pre: '+'}, name: 'test'}},
        {stateAPIs: {expressions: {post: '+'}, name: 'test'}},
        {useExpression: '+'}
    ])(
        'resolveForwarders throws on invalid expression (%p)',
        (forwarder): void => {
            expect((): ResolvedForwarder =>
                createForwarder(forwarder as Forwarders[string])
            ).toThrow()
        }
    )
    // endregion
    // region determineForwarder
    test('determineForwarder', (): void => {
        const forwarders = resolveForwarders({
            base: BASE_CONFIGURATION.forwarders.base,
            b: {useExpression: 'true'},
            a: {useExpression: 'false'},
            c: {useExpression: 'true'}
        })

        expect(determineForwarder(
            createRequest(), createResponse(), forwarders
        )?.name).toStrictEqual('b')
        expect(determineForwarder(
            createRequest(), createResponse(), {a: forwarders.a}
        )).toBeNull()
        expect(determineForwarder(createRequest(), createResponse(), {}))
            .toBeNull()
    })
    // endregion
    // region applyStateAPIs
    describe('applyStateAPIs', (): void => {
        const fetchSpy = jest.spyOn(globalThis, 'fetch')

        afterEach((): void => {
            fetchSpy.mockReset()
        })
        afterAll((): void => {
            fetchSpy.mockRestore()
        })

        test('without state apis', async (): Promise<void> => {
            expect(await applyStateAPIs(
                createRequest(), createResponse(), createForwarder({})
            )).toStrictEqual({result: true, scope: {}})
            expect(fetchSpy).not.toHaveBeenCalled()
        })
        test.each([
            [[false, true]],
            [['break', true]],
            [[null, undefined]],
            [[() => {
                throw new Error('test')
            }]]
        ])(
            'skips request for pre results %p',
            async (pre): Promise<void> => {
                const response = createResponse()
                const {result, scope} = await applyStateAPIs(
                    createRequest(),
                    response,
                    createForwarder({stateAPIs: {
                        expressions: {pre: pre.map((value) =>
                            typeof value === 'function' ?
                                value :
                                () => value as APIPreEvaluationResult
                        )},
                        name: 'test',
                        url: 'http://test'
                    }})
                )

                expect(result).toStrictEqual(true)
                expect(scope.test.response).toBeNull()
                expect(fetchSpy).not.toHaveBeenCalled()
            }
        )
        test('breaks request on pre status code', async (): Promise<void> => {
            const response = createResponse()

            expect((await applyStateAPIs(
                createRequest(),
                response,
                createForwarder({stateAPIs: {
                    expressions: {pre: '403'}, name: 'test'
                }})
            )).result).toStrictEqual(false)
            expect(response.statusCode).toStrictEqual(403)
            expect(response.endMock).toHaveBeenCalled()
            expect(fetchSpy).not.toHaveBeenCalled()
        })
        test(
            'runs request and evaluates json response',
            async (): Promise<void> => {
                fetchSpy.mockResolvedValue(Response.json({state: 'up'}))
                const post = jest.fn(() => 'break' as const)
                const skippedPost = jest.fn(() => null)

                const {result, scope} = await applyStateAPIs(
                    createRequest(),
                    createResponse(),
                    createForwarder({stateAPIs: {
                        data: {path: 'state'},
                        expressions: {
                            post: [
                                () => {
                                    throw new Error('test')
                                },
                                post,
                                skippedPost
                            ],
                            pre: [() => null, () => true]
                        },
                        name: 'test',
                        options: {method: 'POST'},
                        urlExpression: '`http://test/${data.path}`'
                    }})
                )

                expect(result).toStrictEqual(true)
                expect(fetchSpy).toHaveBeenCalledWith(
                    'http://test/state', {method: 'POST'}
                )
                expect(scope.test.response?.data)
                    .toStrictEqual({state: 'up'})
                expect(post).toHaveBeenCalled()
                expect(skippedPost).not.toHaveBeenCalled()
            }
        )
        test(
            'breaks request on post status code',
            async (): Promise<void> => {
                fetchSpy.mockResolvedValue(new Response('plain'))
                const response = createResponse()

                const {result, scope} = await applyStateAPIs(
                    createRequest(),
                    response,
                    createForwarder({stateAPIs: [
                        {
                            expressions: {
                                post: 'stateAPI.response.data === undefined ' +
                                    '? 503 : null',
                                pre: 'true'
                            },
                            name: 'first',
                            url: 'http://test'
                        },
                        {expressions: {pre: 'true'}, name: 'second'}
                    ]})
                )

                expect(result).toStrictEqual(false)
                expect(response.statusCode).toStrictEqual(503)
                expect(response.endMock).toHaveBeenCalled()
                expect(scope).not.toHaveProperty('second')
                expect(fetchSpy).toHaveBeenCalledTimes(1)
            }
        )
        test(
            'provides request and parsing errors to post expressions',
            async (): Promise<void> => {
                const errors: Array<Error | null | undefined> = []
                const post = (...parameters: EvaluationParameters) => {
                    errors.push(parameters[
                        UTILITY_SCOPE_VALUES.length + 1
                    ] as Error | null | undefined)

                    return null
                }
                const forwarder = createForwarder({stateAPIs: {
                    expressions: {post, pre: 'true'},
                    name: 'test',
                    urlExpression: () => {
                        throw new Error('test')
                    }
                }})

                fetchSpy.mockRejectedValueOnce(new Error('request'))
                await applyStateAPIs(
                    createRequest(), createResponse(), forwarder
                )

                fetchSpy.mockResolvedValueOnce(new Response(
                    '{invalid', {headers: {'content-type': 'application/json'}}
                ))
                await applyStateAPIs(
                    createRequest(), createResponse(), forwarder
                )

                expect(errors).toHaveLength(2)
                expect(errors[0]?.message).toStrictEqual('request')
                expect(errors[1]?.name).toStrictEqual('SyntaxError')
            }
        )
    })
    // endregion
    // region addParsedContentToRequest
    test('addParsedContentToRequest', (): void => {
        const request = createRequest(
            ['POST / HTTP/1.1\r\n', 'host: a\r\n\r\n{"a": 2}'],
            {'content-type': 'application/json; charset=utf-8'}
        )
        addParsedContentToRequest(request)
        expect(request.socket.buffer.body).toStrictEqual('{"a": 2}')
        expect(request.socket.buffer.content).toStrictEqual({a: 2})

        const invalidRequest = createRequest(
            ['POST / HTTP/1.1\r\n\r\n{invalid'],
            {'content-type': 'application/json'}
        )
        addParsedContentToRequest(invalidRequest)
        expect(invalidRequest.socket.buffer.content).toBeUndefined()

        const plainRequest = createRequest(['GET / HTTP/1.1\r\n\r\n{}'])
        addParsedContentToRequest(plainRequest)
        expect(plainRequest.socket.buffer).not.toHaveProperty('body')
    })
    // endregion
    // region transformHeaders
    const transformation = (
        source: unknown, target: unknown
    ): ResolvedHeaderTransformation => ({
        sourceRun: () => source,
        targetRun: () => target
    }) as unknown as ResolvedHeaderTransformation
    const HEADER = 'GET / HTTP/1.1\r\nhost: a\r\nx-remove: b\r\n\r\nbody'
    testEach<typeof transformHeaders>(
        'transformHeaders',
        transformHeaders,

        [HEADER, HEADER, [], PARAMETERS],
        [HEADER, HEADER, [transformation('', ' ')], PARAMETERS],
        [HEADER, HEADER, [transformation(null, undefined)], PARAMETERS],
        [
            'GET / HTTP/1.1\r\nhost: a\r\nx-remove: b\r\nx-add: c\r\n\r\nbody',
            HEADER,
            [transformation(undefined, 'x-add: c')],
            PARAMETERS
        ],
        [
            'GET / HTTP/1.1\r\nhost: a\r\nx-remove: b\r\nx-add: 2\r\n\r\nbody',
            HEADER,
            [transformation(
                null,
                (_substring: string, delimiter: string) =>
                    `x-add: ${String(delimiter.length)}`
            )],
            PARAMETERS
        ],
        [
            'GET / HTTP/1.1\r\nhost: a\r\n\r\nbody',
            HEADER,
            [transformation(/x-remove: [^\r]+\r\n/, '')],
            PARAMETERS
        ],
        [
            'GET / HTTP/1.1\r\nhost: c\r\nx-remove: b\r\n\r\nbody',
            HEADER,
            [
                transformation('host: a', 'host: c'),
                transformation(/x-unknown/, 'unused')
            ],
            PARAMETERS
        ],
        [
            HEADER,
            HEADER,
            [
                {
                    source: 'a',
                    sourceRun: () => {
                        throw new Error('test')
                    },
                    target: 'b',
                    targetRun: () => 'b'
                },
                {
                    sourceRun: () => {
                        throw new Error('test')
                    },
                    targetRun: () => ''
                }
            ],
            PARAMETERS
        ]
    )
    // endregion
    // region reverseProxyBufferedRequest
    describe('reverseProxyBufferedRequest', (): void => {
        const RESPONSE = 'HTTP/1.1 200 OK\r\nx-backend: yes\r\n\r\nbody'

        let backend: NetServer
        let port = 0
        const received: Array<string> = []
        const sockets: Array<Socket> = []

        beforeAll(async (): Promise<void> => {
            backend = createNetServer((socket: Socket): void => {
                sockets.push(socket)

                let content = ''
                socket.on('data', (data: Buffer): void => {
                    content += data.toString()

                    if (content.endsWith('second')) {
                        received.push(content)
                        socket.write(RESPONSE)
                    }
                })
            })
            await new Promise<void>((resolve): void => {
                backend.listen(0, HOST, resolve)
            })
            port = (backend.address() as AddressInfo).port
        })
        afterEach((): void => {
            received.length = 0
        })
        afterAll(async (): Promise<void> => {
            for (const socket of sockets)
                socket.destroy()

            await new Promise((resolve): void => {
                backend.close(resolve)
            })
        })

        const readResponse = (socket: PassThrough): Promise<string> =>
            new Promise((resolve): void => {
                socket.once('data', (data: Buffer): void => {
                    resolve(data.toString())
                })
            })

        test(
            'forwards with header transformations',
            async (): Promise<void> => {
                const clientSocket = new PassThrough()
                const responseContent = readResponse(clientSocket)

                await reverseProxyBufferedRequest(
                    createRequest([
                        'GET / HTTP/1.0\r\nHost: proxy\r\n\r\n', 'second'
                    ]),
                    createResponse(clientSocket),
                    createForwarder({
                        headerTransformations: {
                            retrieve: {
                                source: '"x-backend: yes"',
                                target: '"x-backend: no"'
                            },
                            send: {target: '"x-added: yes"'}
                        },
                        host: HOST,
                        port,
                        tls: false
                    }),
                    {}
                )

                expect(await responseContent).toStrictEqual(
                    'HTTP/1.1 200 OK\r\nx-backend: no\r\n\r\nbody'
                )
                expect(received).toStrictEqual([
                    `GET / HTTP/1.0\r\nHost: ${HOST}:${String(port)}` +
                    '\r\nx-added: yes\r\n\r\nsecond'
                ])
            }
        )
        test('pipes plain responses', async (): Promise<void> => {
            const clientSocket = new PassThrough()
            const responseContent = readResponse(clientSocket)

            const finished = reverseProxyBufferedRequest(
                createRequest(['GET / HTTP/1.1\r\nhost: proxy\r\n\r\nsecond']),
                createResponse(clientSocket),
                createForwarder({host: HOST, port, tls: false}),
                {}
            )

            expect(await responseContent).toStrictEqual(RESPONSE)

            // NOTE: Closing the client connection closes the backend one.
            clientSocket.destroy()
            await expect(finished).resolves.toBeUndefined()
        })
        test('rejects on connection errors', async (): Promise<void> => {
            const closedPort = await getClosedPort()

            await expect(reverseProxyBufferedRequest(
                createRequest(),
                createResponse(),
                createForwarder({
                    host: HOST, port: closedPort, tls: false
                }),
                {}
            )).rejects.toThrow()

            expect(logErrorSpy).toHaveBeenCalledTimes(1)
            expect(logErrorSpy).toHaveBeenCalledWith(
                'Proxy to server error', ANY_ERROR
            )
        })
        describe('with tls backend', (): void => {
            let secureBackend: SecureNetServer
            let securePort = 0

            beforeAll(async (): Promise<void> => {
                secureBackend = createSecureNetServer(
                    {
                        cert: await readFile(CERTIFICATE_PATH),
                        key: await readFile(PRIVATE_KEY_PATH)
                    },
                    (socket): void => {
                        socket.on('data', (): void => {
                            socket.end(RESPONSE)
                        })
                    }
                )
                await new Promise<void>((resolve): void => {
                    secureBackend.listen(0, HOST, resolve)
                })
                securePort = (secureBackend.address() as AddressInfo).port
            })
            afterAll(async (): Promise<void> => {
                await new Promise((resolve): void => {
                    secureBackend.close(resolve)
                })
            })

            test(
                'accepts self-signed certificates by default',
                async (): Promise<void> => {
                    const clientSocket = new PassThrough()
                    const responseContent = readResponse(clientSocket)

                    await reverseProxyBufferedRequest(
                        createRequest(['GET / HTTP/1.1\r\n\r\n']),
                        createResponse(clientSocket),
                        createForwarder({host: HOST, port: securePort}),
                        {}
                    )

                    expect(await responseContent).toStrictEqual(RESPONSE)
                }
            )
            test(
                'rejects unauthorized certificates if configured',
                async (): Promise<void> => {
                    await expect(reverseProxyBufferedRequest(
                        createRequest(['GET / HTTP/1.1\r\n\r\n']),
                        createResponse(),
                        createForwarder({
                            host: HOST,
                            port: securePort,
                            rejectUnauthorized: true
                        }),
                        {}
                    )).rejects.toThrow()

                    expect(logErrorSpy).toHaveBeenCalledWith(
                        'Proxy to server error', ANY_ERROR
                    )
                }
            )
        })
    })
    // endregion
    // region server
    describe('loadConfiguration', (): void => {
        let directoryPath = ''

        beforeAll(async (): Promise<void> => {
            await importFilesystemAPI()

            directoryPath = await mkdtemp(join(tmpdir(), 'rpm-test-'))
        })
        afterAll(async (): Promise<void> => {
            await rm(directoryPath, {force: true, recursive: true})
        })

        test('without configuration files', async (): Promise<void> => {
            expect(await loadConfiguration(directoryPath))
                .toStrictEqual({...BASE_CONFIGURATION, port: 8080})
        })
        test('with configuration files', async (): Promise<void> => {
            await writeFile(
                join(directoryPath, 'configuration.json'),
                JSON.stringify({
                    host: 'custom',
                    port: {__evaluate__: '2 * 1000'}
                })
            )
            await writeFile(
                join(directoryPath, 'secure-configuration.json'),
                JSON.stringify({
                    privateKeyPath: {
                        __evaluate__: '`${configuration.host}.key`'
                    }
                })
            )

            const configuration = await loadConfiguration(directoryPath)

            expect(configuration.host).toStrictEqual('custom')
            expect(configuration.port).toStrictEqual(2000)
            expect(configuration.privateKeyPath).toStrictEqual('custom.key')
            expect(configuration.forwarders)
                .toStrictEqual(BASE_CONFIGURATION.forwarders)
            // NOTE: Given base configuration should not be modified.
            expect(BASE_CONFIGURATION.host).toStrictEqual('')
        })
        test('loads key and certificate files', async (): Promise<void> => {
            await writeFile(
                join(directoryPath, 'secure-configuration.json'),
                JSON.stringify({
                    privateKeyPath: PRIVATE_KEY_PATH,
                    publicKeyPath: CERTIFICATE_PATH
                })
            )

            const configuration = await loadConfiguration(directoryPath)

            expect(configuration.nodeServerOptions).toStrictEqual({
                cert: await readFile(CERTIFICATE_PATH),
                key: await readFile(PRIVATE_KEY_PATH)
            })
        })
    })
    describe('handleRequest', (): void => {
        test('answers 502 without forwarder', async (): Promise<void> => {
            const response = createResponse()

            const request = createRequest()
            await handleRequest(request, response, {})

            expect(response.statusCode).toStrictEqual(502)
            expect(response.endMock).toHaveBeenCalled()
            expect(logErrorSpy).toHaveBeenCalledWith(
                'No forwarder found for given request:', request
            )
        })
        test(
            'parses body and applies state apis',
            async (): Promise<void> => {
                const request = createRequest(
                    ['POST / HTTP/1.1\r\n\r\n{"blocked": true}'],
                    {'content-type': 'application/json'}
                )
                const response = createResponse()

                await handleRequest(
                    request,
                    response,
                    {test: createForwarder({stateAPIs: {
                        expressions: {
                            pre: 'request.socket.buffer.content.blocked ' +
                                '? 403 : false'
                        },
                        name: 'test'
                    }})},
                    true
                )

                expect(request.socket.buffer.content)
                    .toStrictEqual({blocked: true})
                expect(response.statusCode).toStrictEqual(403)
            }
        )
        test(
            'waits for buffered request and survives proxy errors',
            async (): Promise<void> => {
                const request = createRequest(['GET / HTTP/1.1\r\n\r\n'])
                request.socket.buffer.finished = false
                setTimeout((): void => {
                    request.socket.buffer.finished = true
                })

                await expect(handleRequest(
                    request,
                    createResponse(),
                    {test: createForwarder({
                        host: HOST,
                        port: await getClosedPort(),
                        tls: false
                    })}
                )).resolves.toBeUndefined()

                // NOTE: Logged once by the proxy and once by the handler.
                expect(logErrorSpy).toHaveBeenCalledTimes(2)
                expect(logErrorSpy).toHaveBeenNthCalledWith(
                    1, 'Proxy to server error', ANY_ERROR
                )
                expect(logErrorSpy).toHaveBeenNthCalledWith(
                    2, ANY_ERROR
                )
            }
        )
    })
    describe('createServer', (): void => {
        const getConfiguration = (
            configuration: Partial<Configuration> = {}
        ): Configuration => ({
            ...copy(BASE_CONFIGURATION as unknown as Configuration),
            port: 0,
            ...configuration
        })
        /*
            NOTE: Servers left open by a failing test would prevent jest from
            exiting.
        */
        const cleanups: Array<() => Promise<unknown>> = []
        afterEach(async (): Promise<void> => {
            await Promise.all(cleanups.splice(0).map((cleanup) => cleanup()))
        })
        const closeServerAfterTest = (server: {
            close: (callback: () => void) => unknown
            closeAllConnections?: () => void
        }): void => {
            cleanups.push((): Promise<void> => new Promise((resolve): void => {
                server.close((): void => {
                    resolve()
                })
                server.closeAllConnections?.()
            }))
        }

        test('creates a secure server', (): void => {
            expect(createServer(getConfiguration({
                privateKeyPath: 'key', publicKeyPath: 'certificate'
            })).instance.constructor.name).toStrictEqual('Server')
        })
        test(
            'listens on all interfaces or given host',
            async (): Promise<void> => {
                const server = createServer(getConfiguration())
                cleanups.push(server.stop)
                await server.start()

                expect((server.instance.address() as AddressInfo).address)
                    .toMatch(/^(::|0\.0\.0\.0)$/)

                const localServer =
                    createServer(getConfiguration({host: HOST}))
                cleanups.push(localServer.stop)
                await localServer.start()

                expect((localServer.instance.address() as AddressInfo).address)
                    .toStrictEqual(HOST)
            }
        )
        test('forwards requests to backend', async (): Promise<void> => {
            const backend = createHTTPServer((request, response): void => {
                response.setHeader('Connection', 'close')
                response.end(`backend: ${request.headers.host as string}`)
            })
            closeServerAfterTest(backend)
            await new Promise<void>((resolve): void => {
                backend.listen(0, HOST, resolve)
            })
            const backendPort = (backend.address() as AddressInfo).port

            const server = createServer(getConfiguration({forwarders: {
                base: {
                    ...BASE_CONFIGURATION.forwarders.base,
                    host: HOST,
                    port: backendPort,
                    stateAPIs: [],
                    tls: false
                },
                backend: {}
            }}))
            cleanups.push(server.stop)
            await server.start()

            // NOTE: The used port is already occupied now.
            const {port} = server.instance.address() as AddressInfo
            await expect(createServer(getConfiguration({port})).start())
                .rejects.toThrow()

            const client = connect(port, HOST)
            let content = ''
            client.on('data', (data: Buffer): void => {
                content += data.toString()
            })
            client.write(
                'GET / HTTP/1.1\r\nHost: proxy\r\nConnection: close\r\n\r\n'
            )
            await new Promise((resolve): void => {
                client.on('close', resolve)
            })

            expect(content).toMatch(/^HTTP\/1\.1 200 OK\r\n/)
            expect(content).toMatch(
                new RegExp(`backend: ${HOST}:${String(backendPort)}$`)
            )
        })
        test(
            'forwards encrypted requests to backend',
            async (): Promise<void> => {
                const backend = createHTTPServer((_request, response): void => {
                    response.setHeader('Connection', 'close')
                    response.end('backend')
                })
                closeServerAfterTest(backend)
                await new Promise<void>((resolve): void => {
                    backend.listen(0, HOST, resolve)
                })

                const server = createServer(getConfiguration({
                    forwarders: {
                        base: {
                            ...BASE_CONFIGURATION.forwarders.base,
                            host: HOST,
                            port: (backend.address() as AddressInfo).port,
                            stateAPIs: [],
                            tls: false
                        },
                        backend: {}
                    },
                    nodeServerOptions: {
                        cert: await readFile(CERTIFICATE_PATH),
                        key: await readFile(PRIVATE_KEY_PATH)
                    },
                    privateKeyPath: PRIVATE_KEY_PATH,
                    publicKeyPath: CERTIFICATE_PATH
                }))
                cleanups.push(server.stop)
                await server.start()

                const client = connectSecure({
                    host: HOST,
                    port: (server.instance.address() as AddressInfo).port,
                    rejectUnauthorized: false
                })
                let content = ''
                client.on('data', (data: Buffer): void => {
                    content += data.toString()
                })
                client.write(
                    'GET / HTTP/1.1\r\nHost: proxy\r\nConnection: close' +
                    '\r\n\r\n'
                )
                await new Promise((resolve): void => {
                    client.on('close', resolve)
                })

                expect(content).toMatch(/^HTTP\/1\.1 200 OK\r\n/)
                expect(content).toMatch(/backend$/)
            }
        )
        test('stop closes open connections', async (): Promise<void> => {
            const server = createServer(getConfiguration())
            cleanups.push(server.stop)
            await server.start()
            const connected = new Promise((resolve): void => {
                server.instance.once('connection', resolve)
            })

            const client = connect(
                (server.instance.address() as AddressInfo).port, HOST
            )
            // NOTE: Destroying the connection resets the client socket.
            client.on('error', (): void => {
                // Ignore connection resets.
            })
            await connected
            const closed = new Promise((resolve): void => {
                client.on('close', resolve)
            })
            expect(server.sockets).toHaveLength(1)

            await server.stop()
            await closed
        })
    })
    // endregion
})
