<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. See https://creativecommons.org/licenses/by/3.0/deed.de
endregion -->

Project status
--------------

[![npm](https://img.shields.io/npm/v/reverse-proxy-middleware?color=%23d55e5d&label=npm%20package%20version&logoColor=%23d55e5d)](https://www.npmjs.com/package/reverse-proxy-middleware)
[![npm downloads](https://img.shields.io/npm/dy/reverse-proxy-middleware.svg)](https://www.npmjs.com/package/reverse-proxy-middleware)

[![<LABEL>](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/build.yaml/badge.svg)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/build.yaml)
[![<LABEL>](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/test.yaml/badge.svg)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/test.yaml)
[![<LABEL>](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/test-coverage-report.yaml/badge.svg)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/test-coverage-report.yaml)
[![<LABEL>](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/check-types.yaml/badge.svg)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/check-types.yaml)
[![<LABEL>](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/lint.yaml/badge.svg)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/lint.yaml)
[![<LABEL>](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/build-image-periodically-2-branches.yaml/badge.svg)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/build-image-periodically-2-branches.yaml)

[![code coverage](https://coveralls.io/repos/github/thaibault/reverse-proxy-middleware/badge.svg)](https://coveralls.io/github/thaibault/reverse-proxy-middleware)

[![documentation website](https://img.shields.io/website-up-down-green-red/http/torben.website/reverse-proxy-middleware.svg?label=documentation-website)](http://torben.website/reverse-proxy-middleware)

Use case
--------

Easy and dynamically configurable reverse proxy. This tool can act as a
middleware to check incoming requests via external bot filtering services such
as ReCaptcha or friendlycaptcha.
Adding state via session token with external authentication apis is possible as
applying any external api given data to the incoming and conditionally
forwarded requests.

### Quick start

#### Simple forwarding

Simple reverse proxy request from `http://localhost:8080` to
`https://www.google.com` without modifying the entire request.

```
{
  "forwarders": {
    "google": {
      "host": "www.google.com"
    }
  }
}
```

Since the proxy starts at localhost on port 8080 as a default configuration you
can check the configuration via a simple curl command:

```curl --verbose http://localhost:8080```

Behind there are a some commonly use defaults configured under key
"configuration" in [package.json](package.json). Please have a look.

#### Distributing requests to different backends

Here is how to distribute incoming requests randomly between google and bing:

```
{
  "forwarders": {
    "bing": {
      "host": "www.bing.com",
      "useExpression": "Math.random() < 0.5"
    },
    "google": {
      "host": "www.google.com"
    }
  }
}
```

Forwarders are iterated in alphabetical order of their name and `useExpression`
are getting evaluated. Since "google" is always "used" it depends on the random
outcome of bing's expression if it is beeing used or not.

Since this proxy just streams the whole request through it could be used as
basic load balancer with this configuration.

#### Rewriting headers for underlying backend

Headers can be replaced in both directions. Client-Request to forward or
retrieved responses given from configured backend:

# TODO test

```
{
  "forwarders": {
    "bing": {
      "host": "www.bing.com",
      "headerTransformations": {
        "send": [
            {
                "source": "/X-Special-Client-Header-Name: (.+)/",
                "target": "'New-Header-Name: $1'"
            }
        ],

        "retrieve": [
            {
                "source": "/set-cookie: (.+)/",
                "target": "'X-Prevented-Cookie: $1'"
            }
        ]
      }
    }
  }
}
```

```
    curl \
        --header 'X-Special-Client-Header-Name: value' \
        --verbose \
        http://localhost:8080 \
            1>/dev/null
```

#### Validating request via external service

To configure the middleware for providing a bot-filtering mechanism add a
`configure.json` file and mount them into a docker container.

```JavaScript
TODO
```

<!-- region modline
vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:
endregion -->
