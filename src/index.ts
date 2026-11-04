// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module web-node */
'use strict'
/* !
    region header
    [Project page](https://tsickert.com/webNode)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import type {ResolvedForwarders, Server} from './type'

import {CLOSE_EVENT_NAMES, importFilesystemAPI, represent} from 'clientnode'

import {
    createServer, loadConfiguration, log, resolveForwarders
} from './helper'
// endregion
await importFilesystemAPI()

const CONFIGURATION = await loadConfiguration()
const FORWARDERS: ResolvedForwarders =
    resolveForwarders(CONFIGURATION.forwarders)

const server: Server = createServer(CONFIGURATION, FORWARDERS)
// region start / stop
if (import.meta.main) {
    void log.info(
        'Start server with configuration:', represent(CONFIGURATION)
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
