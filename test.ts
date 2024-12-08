// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

    License
    -------

    This library written by Torben Sickert stand under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {describe} from '@jest/globals'
import {testEach} from 'clientnode/test-helper'

import {resolveForwarders} from './helper'
import packageConfiguration from './package.json'
// endregion
const {configuration: BASE_CONFIGURATION} = packageConfiguration

const positiveUseExpression = () => true

describe('helper', (): void => {
    testEach<typeof resolveForwarders>(
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
})
