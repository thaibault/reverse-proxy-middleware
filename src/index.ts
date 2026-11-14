// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module reverse-proxy-middleware */
'use strict'
/* !
    region header
    [Project page](https://tsickert.com/reverse-proxy-middleware)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/
// region imports
import type {Mapping} from 'clientnode'

import type {ResolvedForwarders, Server} from './type'

import {CLOSE_EVENT_NAMES, importFilesystemAPI, represent} from 'clientnode'

import {
    createServer, loadConfiguration, log, resolveForwarders
} from './helper'
// endregion
await importFilesystemAPI()

const CONFIGURATION = await loadConfiguration()
log.level = CONFIGURATION.logLevel
const FORWARDERS: ResolvedForwarders =
    resolveForwarders(CONFIGURATION.forwarders)

const server: Server = createServer(CONFIGURATION, FORWARDERS)
// region start / stop
if (import.meta.main) {
    // NOTE: Avoid writing keys and certificates into logs.
    const nodeServerOptions: Mapping<unknown> = {
        ...CONFIGURATION.nodeServerOptions
    }
    for (const name of ['ca', 'cert', 'key', 'passphrase', 'pfx'])
        if (Object.prototype.hasOwnProperty.call(nodeServerOptions, name))
            nodeServerOptions[name] = '[hidden]'
    void log.info(
        'Start server with configuration:',
        represent({...CONFIGURATION, nodeServerOptions})
    )
    void log.debug('Apply resolved forwarder:', represent(FORWARDERS))

    void server.start()

    for (const name of CLOSE_EVENT_NAMES)
        process.on(name, () => {
            void log.info(`\nGot "${name}" signal: stopping server.`)

            void server.stop()
        })
}
// endregion
export default server
