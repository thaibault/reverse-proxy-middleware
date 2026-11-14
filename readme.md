<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

License
-------

This library written by Torben Sickert stands under a creative commons naming
4.0 international license.
See https://creativecommons.org/licenses/by/4.0/deed.de
endregion -->

<!--|deDE:Projektstatus-->
<!--|frFR:Statut du projet-->
Project status
--------------

[![npm](https://img.shields.io/npm/v/reverse-proxy-middleware?color=%23d55e5d&label=npm%20package%20version&logoColor=%23d55e5d&style=for-the-badge)](https://www.npmjs.com/package/reverse-proxy-middleware)
[![npm downloads](https://img.shields.io/npm/dy/reverse-proxy-middleware.svg?style=for-the-badge)](https://www.npmjs.com/package/reverse-proxy-middleware)

[![build](https://img.shields.io/github/actions/workflow/status/thaibault/reverse-proxy-middleware/build.yaml?style=for-the-badge)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/build.yaml)
[![build push package](https://img.shields.io/github/actions/workflow/status/thaibault/reverse-proxy-middleware/build-package-and-push.yaml?label=build%20push%20package&style=for-the-badge)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/build-package-and-push.yaml)

[![check types](https://img.shields.io/github/actions/workflow/status/thaibault/reverse-proxy-middleware/check-types.yaml?label=check%20types&style=for-the-badge)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/check-types.yaml)
[![lint](https://img.shields.io/github/actions/workflow/status/thaibault/reverse-proxy-middleware/lint.yaml?label=lint&style=for-the-badge)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/lint.yaml)
[![test](https://img.shields.io/github/actions/workflow/status/thaibault/reverse-proxy-middleware/test-coverage-report.yaml?label=test&style=for-the-badge)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/test-coverage-report.yaml)

[![build push image](https://img.shields.io/github/actions/workflow/status/thaibault/reverse-proxy-middleware/build-image-and-push-periodically-2.yaml?label=build%20push%20image&style=for-the-badge)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/build-image-and-push-periodically-2.yaml)

[![code coverage](https://img.shields.io/coverallsCoverage/github/thaibault/reverse-proxy-middleware?label=code%20coverage&style=for-the-badge)](https://coveralls.io/github/thaibault/reverse-proxy-middleware)

[![deploy web documentation](https://img.shields.io/github/actions/workflow/status/thaibault/reverse-proxy-middleware/deploy-web-documentation.yaml?label=deploy%20web%20documentation&style=for-the-badge)](https://github.com/thaibault/reverse-proxy-middleware/actions/workflows/deploy-web-documentation.yaml)
[![web documentation](https://img.shields.io/website-up-down-green-red/https/tsickert.com/reverse-proxy-middleware.svg?label=web-documentation&style=for-the-badge)](https://tsickert.com/reverse-proxy-middleware)

<!--|deDE:Einsatzmöglichkeiten-->
<!--|frFR:Cas d'utilisation-->
Use case
--------

A small reverse proxy configured with a single JSON file. Each incoming request
is passed on to one of the configured backends ("forwarders"). Before that, the
proxy can ask third party services ("state APIs"), e.g. a bot filter like
reCAPTCHA or friendlycaptcha or an authentication service, and answer the
request itself depending on their responses. Request and response headers can
be rewritten on the way through. All decisions are short JavaScript
expressions inside the configuration.
<!--deDE:
    Ein kleiner Reverse-Proxy, der über eine einzige JSON-Datei konfiguriert
    wird. Jede eingehende Anfrage wird an eines der konfigurierten Backends
    ("Forwarder") weitergereicht. Vorher kann der Proxy Dienste von
    Drittanbietern ("State-APIs") befragen, z. B. einen Bot-Filter wie
    reCAPTCHA oder friendlycaptcha oder einen Authentifizierungsdienst, und
    die Anfrage abhängig von deren Antworten selbst beantworten. Anfrage- und
    Antwort-Header lassen sich unterwegs umschreiben. Alle Entscheidungen
    sind kurze JavaScript-Ausdrücke in der Konfiguration.
-->
<!--frFR:
    Un petit proxy inverse configuré par un seul fichier JSON. Chaque requête
    entrante est transmise à l'un des backends configurés ("forwarders").
    Auparavant, le proxy peut interroger des services tiers ("state APIs"),
    par exemple un filtre anti-bots comme reCAPTCHA ou friendlycaptcha ou un
    service d'authentification, et répondre lui-même à la requête selon
    leurs réponses. Les en-têtes de requête et de réponse peuvent être
    réécrits au passage. Toutes les décisions sont de courtes expressions
    JavaScript dans la configuration.
-->

<div class="wd-table-of-contents">
    <h2 id="content">Content<!--deDE:Inhalt--><!--frFR:Contenu--></h2>
    <!--wd-table-of-contents-->
</div>

Installation
------------

Install the command globally via npm and start it in the folder which holds
your "configuration.json":
<!--deDE:
    Installieren Sie den Befehl global über npm und starten Sie ihn in dem
    Ordner, der Ihre "configuration.json" enthält:
-->
<!--frFR:
    Installez la commande globalement via npm et lancez-la dans le dossier
    qui contient votre "configuration.json":
-->

```bash
npm install --global reverse-proxy-middleware
reverse-proxy-middleware
```

Or run the container image and mount the configuration into it:
<!--deDE:
    Oder starten Sie das Container-Image und binden Sie die Konfiguration
    ein:
-->
<!--frFR:Ou lancez l'image de conteneur et montez-y la configuration:-->

```bash
docker run \
    --name reverse-proxy-middleware \
    --publish 8080:8080 \
    --rm \
    --volume "$(pwd)/configuration.json:/application/configuration.json" \
    ghcr.io/thaibault/reverse-proxy-middleware:latest
```

"systemd.service" in this repository is a unit which runs the container in
the Docker network "proxy" (e.g. behind the
[proxy](https://tsickert.com/proxy) project) and reads its configuration from
"/srv/http/reverse-proxy-middleware/configuration.json".
<!--deDE:
    "systemd.service" in diesem Repository ist eine Unit, die den Container
    im Docker-Netzwerk "proxy" betreibt (z. B. hinter dem Projekt
    [proxy](https://tsickert.com/proxy)) und ihre Konfiguration aus
    "/srv/http/reverse-proxy-middleware/configuration.json" liest.
-->
<!--frFR:
    "systemd.service" dans ce dépôt est une unité qui exécute le conteneur
    dans le réseau Docker "proxy" (par exemple derrière le projet
    [proxy](https://tsickert.com/proxy)) et lit sa configuration depuis
    "/srv/http/reverse-proxy-middleware/configuration.json".
-->

Configuration
-------------

On start, the defaults under the key "configuration" in
[package.json](package.json) are extended by "configuration.json" and then by
"secure-configuration.json" from the current working directory. Both files
are optional, the second one is meant for secrets. The top level options are:
<!--deDE:
    Beim Start werden die Standardwerte unter dem Schlüssel "configuration"
    in [package.json](package.json) durch "configuration.json" und danach
    durch "secure-configuration.json" aus dem aktuellen Arbeitsverzeichnis
    erweitert. Beide Dateien sind optional, die zweite ist für Geheimnisse
    gedacht. Die Optionen der obersten Ebene sind:
-->
<!--frFR:
    Au démarrage, les valeurs par défaut sous la clé "configuration" dans
    [package.json](package.json) sont étendues par "configuration.json" puis
    par "secure-configuration.json" du répertoire de travail courant. Les
    deux fichiers sont facultatifs, le second est destiné aux secrets. Les
    options de premier niveau sont:
-->

- "port" (default: the environment variable "PORT" or "8080"): where the proxy listens.<!--deDE:"port" (Standard: die Umgebungsvariable "PORT" oder "8080"): wo der Proxy lauscht.--><!--frFR:"port" (par défaut: la variable d'environnement "PORT" ou "8080"): où le proxy écoute.-->
- "host" (default empty, meaning all network interfaces): the address to listen on, e.g. "127.0.0.1".<!--deDE:"host" (Standard leer, also alle Netzwerkschnittstellen): die Adresse, auf der gelauscht wird, z. B. "127.0.0.1".--><!--frFR:"host" (vide par défaut, donc toutes les interfaces réseau): l'adresse d'écoute, par exemple "127.0.0.1".-->
- "forwarders": the backends, see below.<!--deDE:"forwarders": die Backends, siehe unten.--><!--frFR:"forwarders": les backends, voir ci-dessous.-->
- "parseBody" (default "false"): parses JSON request bodies for expressions.<!--deDE:"parseBody" (Standard "false"): wertet JSON-Anfragekörper für Ausdrücke aus.--><!--frFR:"parseBody" (par défaut "false"): analyse les corps de requête JSON pour les expressions.-->
- "logLevel" (default "info"): one of "debug", "info", "warn", "error" and "critical". "debug" logs every forwarded header.<!--deDE:"logLevel" (Standard "info"): einer von "debug", "info", "warn", "error" und "critical". "debug" protokolliert jeden weitergeleiteten Header.--><!--frFR:"logLevel" (par défaut "info"): l'un de "debug", "info", "warn", "error" et "critical". "debug" journalise chaque en-tête transmis.-->
- "publicKeyPath" and "privateKeyPath": certificate and key files which switch the proxy to HTTPS, see below.<!--deDE:"publicKeyPath" und "privateKeyPath": Zertifikats- und Schlüsseldatei, die den Proxy auf HTTPS umstellen, siehe unten.--><!--frFR:"publicKeyPath" et "privateKeyPath": fichiers de certificat et de clé qui font passer le proxy en HTTPS, voir ci-dessous.-->
- "nodeServerOptions": further options of the HTTPS server, see [Node.js](https://nodejs.org/api/https.html#httpscreateserveroptions-requestlistener).<!--deDE:"nodeServerOptions": weitere Optionen des HTTPS-Servers, siehe [Node.js](https://nodejs.org/api/https.html#httpscreateserveroptions-requestlistener).--><!--frFR:"nodeServerOptions": autres options du serveur HTTPS, voir [Node.js](https://nodejs.org/api/https.html#httpscreateserveroptions-requestlistener).-->

### HTTPS

With "publicKeyPath" and "privateKeyPath" set, the proxy only accepts HTTPS
connections. Relative paths start at the working directory, the files are
read on start:
<!--deDE:
    Sind "publicKeyPath" und "privateKeyPath" gesetzt, akzeptiert der Proxy
    nur HTTPS-Verbindungen. Relative Pfade beginnen im Arbeitsverzeichnis,
    die Dateien werden beim Start gelesen:
-->
<!--frFR:
    Lorsque "publicKeyPath" et "privateKeyPath" sont définis, le proxy
    n'accepte que des connexions HTTPS. Les chemins relatifs partent du
    répertoire de travail, les fichiers sont lus au démarrage:
-->

```JSON
{
    "publicKeyPath": "certificate.pem",
    "privateKeyPath": "key.pem"
}
```

Encrypted connections always use HTTP/1.1. Certificate and key end up in
"nodeServerOptions" as "cert" and "key" unless these are given there already.
<!--deDE:
    Verschlüsselte Verbindungen nutzen immer HTTP/1.1. Zertifikat und
    Schlüssel landen als "cert" und "key" in "nodeServerOptions", sofern
    diese dort nicht schon angegeben sind.
-->
<!--frFR:
    Les connexions chiffrées utilisent toujours HTTP/1.1. Le certificat et
    la clé sont placés dans "nodeServerOptions" sous "cert" et "key", sauf
    s'ils y sont déjà indiqués.
-->

<!--|deDE:Weiterleitung-->
<!--|frFR:Redirection-->
### Simple forwarding

This configuration passes every request on "http://localhost:8080" to
"https://example.com" unchanged:
<!--deDE:
    Diese Konfiguration reicht jede Anfrage an "http://localhost:8080"
    unverändert an "https://example.com" weiter:
-->
<!--frFR:
    Cette configuration transmet telle quelle chaque requête sur
    "http://localhost:8080" à "https://example.com":
-->

```JSON
{
    "forwarders": {
        "example": {
            "host": "example.com"
        }
    }
}
```

```bash
curl --verbose http://localhost:8080
```

A forwarder has the following options, the defaults come from the special
forwarder "base":
<!--deDE:
    Ein Forwarder hat die folgenden Optionen, die Standardwerte stammen vom
    besonderen Forwarder "base":
-->
<!--frFR:
    Un forwarder possède les options suivantes, les valeurs par défaut
    viennent du forwarder spécial "base":
-->

- "host" (default "localhost"), "port" (default "443") and "tls" (default "true"): the backend.<!--deDE:"host" (Standard "localhost"), "port" (Standard "443") und "tls" (Standard "true"): das Backend.--><!--frFR:"host" (par défaut "localhost"), "port" (par défaut "443") et "tls" (par défaut "true"): le backend.-->
- "rejectUnauthorized" (default "false"): set it to "true" to only accept backends with a valid certificate.<!--deDE:"rejectUnauthorized" (Standard "false"): auf "true" setzen, um nur Backends mit gültigem Zertifikat zu akzeptieren.--><!--frFR:"rejectUnauthorized" (par défaut "false"): le mettre à "true" pour n'accepter que les backends ayant un certificat valide.-->
- "useExpression" (default "true"): decides whether this forwarder takes the request.<!--deDE:"useExpression" (Standard "true"): entscheidet, ob dieser Forwarder die Anfrage übernimmt.--><!--frFR:"useExpression" (par défaut "true"): décide si ce forwarder prend la requête.-->
- "headerTransformations": rewrites headers, see below.<!--deDE:"headerTransformations": schreibt Header um, siehe unten.--><!--frFR:"headerTransformations": réécrit les en-têtes, voir ci-dessous.-->
- "stateAPIs": requests to third party services, see below.<!--deDE:"stateAPIs": Anfragen an Dienste von Drittanbietern, siehe unten.--><!--frFR:"stateAPIs": requêtes vers des services tiers, voir ci-dessous.-->

For a plain HTTP backend set "tls" to "false" and "port" to e.g. "80".
<!--deDE:
    Für ein reines HTTP-Backend setzen Sie "tls" auf "false" und "port" z.
    B. auf "80".
-->
<!--frFR:
    Pour un backend HTTP simple, mettez "tls" à "false" et "port" par
    exemple à "80".
-->

<!--|deDE:Anfragen auf mehrere Backends verteilen-->
<!--|frFR:Répartir les requêtes sur plusieurs backends-->
### Distributing requests

Forwarders are tried in alphabetical order of their names. The first one whose
"useExpression" results in "true" gets the request. This distributes requests
randomly between two backends, like a basic load balancer:
<!--deDE:
    Forwarder werden in alphabetischer Reihenfolge ihrer Namen geprüft. Der
    erste, dessen "useExpression" "true" ergibt, erhält die Anfrage. So
    werden Anfragen zufällig auf zwei Backends verteilt, wie bei einem
    einfachen Load-Balancer:
-->
<!--frFR:
    Les forwarders sont essayés dans l'ordre alphabétique de leurs noms. Le
    premier dont "useExpression" donne "true" reçoit la requête. Ainsi, les
    requêtes sont réparties aléatoirement entre deux backends, comme avec un
    simple répartiteur de charge:
-->

```JSON
{
    "forwarders": {
        "first": {
            "host": "first.example.com",
            "useExpression": "Math.random() < 0.5"
        },
        "second": {
            "host": "second.example.com"
        }
    }
}
```

Expressions can also route by path, e.g.
"request.url.startsWith('/api/')". If no forwarder matches, the client gets
status code "502".
<!--deDE:
    Ausdrücke können auch nach Pfad weiterleiten, z. B.
    "request.url.startsWith('/api/')". Passt kein Forwarder, erhält der Client
    den Statuscode "502".
-->
<!--frFR:
    Les expressions peuvent aussi aiguiller selon le chemin, par exemple
    "request.url.startsWith('/api/')". Si aucun forwarder ne correspond, le
    client reçoit le code de statut "502".
-->

<!--|deDE:Header umschreiben-->
<!--|frFR:Réécrire les en-têtes-->
### Rewriting headers

"send" transformations apply to the request header sent to the backend,
"retrieve" transformations to the response header sent back to the client.
"source" is an expression resulting in a regular expression or string to
search for, "target" one resulting in its replacement:
<!--deDE:
    "send"-Transformationen gelten für den Anfrage-Header, der an das Backend
    geht, "retrieve"-Transformationen für den Antwort-Header, der zum Client
    zurückgeht. "source" ist ein Ausdruck, der einen regulären Ausdruck oder
    eine zu suchende Zeichenkette ergibt, "target" einer, der deren Ersatz
    ergibt:
-->
<!--frFR:
    Les transformations "send" s'appliquent à l'en-tête de requête envoyé au
    backend, les transformations "retrieve" à l'en-tête de réponse renvoyé au
    client. "source" est une expression donnant une expression régulière ou
    une chaîne à rechercher, "target" une expression donnant son
    remplacement:
-->

```JSON
{
    "forwarders": {
        "example": {
            "host": "example.com",
            "headerTransformations": {
                "send": {
                    "source": "/X-Special-Client-Header-Name: (.+)/gi",
                    "target": "'New-Header-Name: $1'"
                },
                "retrieve": {
                    "source": "/set-cookie: (.+)/gi",
                    "target": "'X-Prevented-Cookie: $1'"
                }
            }
        }
    }
}
```

```bash
curl \
    --header 'X-Special-Client-Header-Name: value' \
    --output /dev/null \
    --verbose \
    http://localhost:8080
```

The backend gets "New-Header-Name: value" and every "set-cookie" header of the
response arrives as "X-Prevented-Cookie". A transformation without "source"
adds the header given by "target", e.g.
"{\"target\": \"'X-Forwarded-By: proxy'\"}". The "host" header is always
replaced by the backend's host.
<!--deDE:
    Das Backend erhält "New-Header-Name: value" und jeder
    "set-cookie"-Header der Antwort kommt als "X-Prevented-Cookie" an. Eine
    Transformation ohne "source" fügt den in "target" angegebenen Header
    hinzu, z. B. "{\"target\": \"'X-Forwarded-By: proxy'\"}". Der
    "host"-Header wird immer durch den Host des Backends ersetzt.
-->
<!--frFR:
    Le backend reçoit "New-Header-Name: value" et chaque en-tête
    "set-cookie" de la réponse arrive sous la forme "X-Prevented-Cookie".
    Une transformation sans "source" ajoute l'en-tête donné par "target",
    par exemple "{\"target\": \"'X-Forwarded-By: proxy'\"}". L'en-tête
    "host" est toujours remplacé par l'hôte du backend.
-->

### State APIs

A state API is a request to a third party service which runs before the
request is forwarded. Its "pre" expressions decide whether it runs, its
"post" expressions evaluate its response. This forwarder only passes requests
on if an authentication service accepts their token:
<!--deDE:
    Eine State-API ist eine Anfrage an einen Dienst eines Drittanbieters,
    die vor dem Weiterleiten der Anfrage läuft. Ihre "pre"-Ausdrücke
    entscheiden, ob sie läuft, ihre "post"-Ausdrücke werten ihre Antwort
    aus. Dieser Forwarder reicht Anfragen nur weiter, wenn ein
    Authentifizierungsdienst ihr Token akzeptiert:
-->
<!--frFR:
    Une state API est une requête vers un service tiers qui s'exécute avant
    la transmission de la requête. Ses expressions "pre" décident si elle
    s'exécute, ses expressions "post" évaluent sa réponse. Ce forwarder ne
    transmet les requêtes que si un service d'authentification accepte leur
    jeton:
-->

```JSON
{
    "forwarders": {
        "example": {
            "host": "example.com",
            "stateAPIs": {
                "name": "authentication",
                "urlExpression": "`https://auth.example.com/check?token=${encodeURIComponent(request.headers['x-token'])}`",
                "options": {"headers": {"accept": "application/json"}},
                "expressions": {
                    "pre": "request.headers['x-token'] ? true : 401",
                    "post": "stateAPI.response?.ok ? null : 403"
                }
            }
        }
    }
}
```

Requests without an "X-Token" header are answered with "401", requests whose
token the service rejects with "403", all others reach "example.com". The
service is requested via
[fetch](https://developer.mozilla.org/docs/Web/API/fetch) with the given
"options". "url" sets a fixed address instead of
"urlExpression".
<!--deDE:
    Anfragen ohne "X-Token"-Header werden mit "401" beantwortet, Anfragen,
    deren Token der Dienst ablehnt, mit "403", alle anderen erreichen
    "example.com". Der Dienst wird über
    [fetch](https://developer.mozilla.org/docs/Web/API/fetch) mit den
    angegebenen "options" angefragt. "url" setzt statt "urlExpression" eine
    feste Adresse.
-->
<!--frFR:
    Les requêtes sans en-tête "X-Token" reçoivent "401", celles dont le
    service rejette le jeton "403", toutes les autres atteignent
    "example.com". Le service est interrogé via
    [fetch](https://developer.mozilla.org/docs/Web/API/fetch) avec les
    "options" données. "url" définit une adresse fixe à la place de
    "urlExpression".
-->

"pre" and "post" accept a single expression or a list, which runs in order.
The result of each "pre" expression means:
<!--deDE:
    "pre" und "post" akzeptieren einen einzelnen Ausdruck oder eine Liste,
    die der Reihe nach läuft. Das Ergebnis jedes "pre"-Ausdrucks bedeutet:
-->
<!--frFR:
    "pre" et "post" acceptent une seule expression ou une liste, exécutée
    dans l'ordre. Le résultat de chaque expression "pre" signifie:
-->

- "true": run the request of this state API.<!--deDE:"true": die Anfrage dieser State-API ausführen.--><!--frFR:"true": exécuter la requête de cette state API.-->
- "false": skip this state API and its remaining "pre" expressions.<!--deDE:"false": diese State-API und ihre übrigen "pre"-Ausdrücke überspringen.--><!--frFR:"false": ignorer cette state API et ses expressions "pre" restantes.-->
- "'break'": stop evaluating "pre" expressions.<!--deDE:"'break'": keine weiteren "pre"-Ausdrücke auswerten.--><!--frFR:"'break'": arrêter d'évaluer les expressions "pre".-->
- "null" or "undefined": continue with the next expression.<!--deDE:"null" oder "undefined": mit dem nächsten Ausdruck fortfahren.--><!--frFR:"null" ou "undefined": continuer avec l'expression suivante.-->
- a number: answer the client with this status code and stop.<!--deDE:eine Zahl: dem Client mit diesem Statuscode antworten und abbrechen.--><!--frFR:un nombre: répondre au client avec ce code de statut et s'arrêter.-->

"post" expressions know the same results except "true" and "false". If no
expression answers the client, the next state API runs and finally the
request is forwarded.
<!--deDE:
    "post"-Ausdrücke kennen dieselben Ergebnisse außer "true" und "false".
    Beantwortet kein Ausdruck den Client, läuft die nächste State-API und
    schließlich wird die Anfrage weitergeleitet.
-->
<!--frFR:
    Les expressions "post" connaissent les mêmes résultats sauf "true" et
    "false". Si aucune expression ne répond au client, la state API suivante
    s'exécute et la requête est finalement transmise.
-->

<!--|deDE:Basis-Konfigurationen-->
<!--|frFR:Configurations de base-->
### Base configurations

Every forwarder inherits from the forwarder "base", and every state API of a
forwarder inherits from its state API named "base". This configuration
forwards to two backends under a sub path and asks one service with
different data depending on the request:
<!--deDE:
    Jeder Forwarder erbt vom Forwarder "base" und jede State-API eines
    Forwarders von dessen State-API namens "base". Diese Konfiguration
    leitet an zwei Backends unter einem Unterpfad weiter und befragt einen
    Dienst je nach Anfrage mit unterschiedlichen Daten:
-->
<!--frFR:
    Chaque forwarder hérite du forwarder "base", et chaque state API d'un
    forwarder hérite de sa state API nommée "base". Cette configuration
    transmet vers deux backends sous un sous-chemin et interroge un service
    avec des données différentes selon la requête:
-->

```JSON
{
    "forwarders": {
        "base": {
            "headerTransformations": {
                "send": {
                    "source": "/^(GET|POST) \\/(.*) (HTTP.*)$/m",
                    "target": "'$1 /sub/path/$2 $3'"
                }
            }
        },
        "first": {
            "host": "first.example.com",
            "useExpression": "Math.random() < 0.5"
        },
        "second": {
            "host": "second.example.com",
            "stateAPIs": [
                {
                    "name": "base",
                    "urlExpression": "`https://service.example.com/?q=${data.query}`",
                    "expressions": {
                        "pre": "request.headers[data.header] ? true : null",
                        "post": "stateAPI.response?.data?.allowed ? null : 403"
                    }
                },
                {
                    "name": "cats",
                    "data": {"header": "x-cats", "query": "cats"}
                },
                {
                    "name": "dogs",
                    "data": {"header": "x-dogs", "query": "dogs"}
                }
            ]
        }
    }
}
```

"data" holds any values for the expressions. JSON responses of state APIs are
available as "stateAPI.response.data".
<!--deDE:
    "data" enthält beliebige Werte für die Ausdrücke. JSON-Antworten von
    State-APIs stehen als "stateAPI.response.data" zur Verfügung.
-->
<!--frFR:
    "data" contient des valeurs quelconques pour les expressions. Les
    réponses JSON des state APIs sont disponibles sous
    "stateAPI.response.data".
-->

<!--|deDE:Ausdrücke-->
<!--|frFR:Expressions-->
### Expressions

Every expression is a JavaScript expression with access to:
<!--deDE:Jeder Ausdruck ist ein JavaScript-Ausdruck mit Zugriff auf:-->
<!--frFR:Chaque expression est une expression JavaScript ayant accès à:-->

- "request": the client request with "url", "method" and "headers".<!--deDE:"request": die Client-Anfrage mit "url", "method" und "headers".--><!--frFR:"request": la requête du client avec "url", "method" et "headers".-->
- "response": the response to the client (not the one of a state API).<!--deDE:"response": die Antwort an den Client (nicht die einer State-API).--><!--frFR:"response": la réponse au client (pas celle d'une state API).-->
- "stateAPI": the current state API with its "configuration", "error" and "response".<!--deDE:"stateAPI": die aktuelle State-API mit "configuration", "error" und "response".--><!--frFR:"stateAPI": la state API courante avec "configuration", "error" et "response".-->
- "stateAPIs": all state APIs of the forwarder by name, e.g. in header transformations.<!--deDE:"stateAPIs": alle State-APIs des Forwarders nach Namen, z. B. in Header-Transformationen.--><!--frFR:"stateAPIs": toutes les state APIs du forwarder par nom, par exemple dans les transformations d'en-têtes.-->
- "data": the state API's "data", the forwarder in "useExpression" and both sockets in header transformations.<!--deDE:"data": die "data" der State-API, der Forwarder in "useExpression" und beide Sockets in Header-Transformationen.--><!--frFR:"data": les "data" de la state API, le forwarder dans "useExpression" et les deux sockets dans les transformations d'en-têtes.-->
- "error": the error of a failed state API request.<!--deDE:"error": der Fehler einer fehlgeschlagenen State-API-Anfrage.--><!--frFR:"error": l'erreur d'une requête de state API échouée.-->
- "array", "datetime", "object", "string", "utility" and more: helpers of [clientnode](https://tsickert.com/clientnode).<!--deDE:"array", "datetime", "object", "string", "utility" und mehr: Hilfsfunktionen von [clientnode](https://tsickert.com/clientnode).--><!--frFR:"array", "datetime", "object", "string", "utility" et d'autres: fonctions utilitaires de [clientnode](https://tsickert.com/clientnode).-->

For example, this send transformation passes the answer of the
authentication service from above on to the backend:
<!--deDE:
    Diese Send-Transformation gibt zum Beispiel die Antwort des
    Authentifizierungsdienstes von oben an das Backend weiter:
-->
<!--frFR:
    Par exemple, cette transformation "send" transmet au backend la réponse
    du service d'authentification ci-dessus:
-->

```JSON
{
    "target": "`X-Allowed: ${stateAPIs.authentication.response?.data?.allowed}`"
}
```

<!--|deDE:Einzelwerte oder Listen-->
<!--|frFR:Valeurs uniques ou listes-->
### Single values or lists

"headerTransformations.send", "headerTransformations.retrieve", "stateAPIs",
"expressions.pre" and "expressions.post" take a single item or a list of
items. "{...}" means the same as "[{...}]".
<!--deDE:
    "headerTransformations.send", "headerTransformations.retrieve",
    "stateAPIs", "expressions.pre" und "expressions.post" nehmen ein
    einzelnes Element oder eine Liste von Elementen. "{...}" bedeutet
    dasselbe wie "[{...}]".
-->
<!--frFR:
    "headerTransformations.send", "headerTransformations.retrieve",
    "stateAPIs", "expressions.pre" et "expressions.post" acceptent un seul
    élément ou une liste d'éléments. "{...}" signifie la même chose que
    "[{...}]".
-->

<!--|deDE:Umgebungsvariablen-->
<!--|frFR:Variables d'environnement-->
### Environment variables

Any value of the configuration can be computed once on start with
"__evaluate__", which has access to "environment" and "configuration":
<!--deDE:
    Jeder Wert der Konfiguration lässt sich beim Start einmalig über
    "__evaluate__" berechnen, das Zugriff auf "environment" und
    "configuration" hat:
-->
<!--frFR:
    Toute valeur de la configuration peut être calculée une fois au
    démarrage via "__evaluate__", qui a accès à "environment" et
    "configuration":
-->

```JSON
{
    "forwarders": {
        "example": {
            "host": {
                "__evaluate__": "environment.BACKEND_HOST ?? 'example.com'"
            }
        }
    }
}
```

The proxy then forwards to the host given in the environment variable
"BACKEND_HOST" or to "example.com". The default "port" works the same way
with "PORT".
<!--deDE:
    Der Proxy leitet dann an den in der Umgebungsvariable "BACKEND_HOST"
    angegebenen Host weiter oder an "example.com". Der Standardwert von
    "port" funktioniert genauso mit "PORT".
-->
<!--frFR:
    Le proxy transmet alors à l'hôte donné dans la variable d'environnement
    "BACKEND_HOST" ou à "example.com". La valeur par défaut de "port"
    fonctionne de la même façon avec "PORT".
-->

<!--|deDE:Entwicklung-->
<!--|frFR:Développement-->
Development
-----------

```bash
yarn install
yarn check
yarn test
yarn serve:simple
```

"yarn check" checks types and lints, "yarn serve:&lt;name&gt;" builds the
proxy and starts it with one of the configurations in "examples/" ("headers",
"random", "simple" or "state-apis").
<!--deDE:
    "yarn check" prüft Typen und lintet, "yarn serve:&lt;name&gt;" baut den
    Proxy und startet ihn mit einer der Konfigurationen in "examples/"
    ("headers", "random", "simple" oder "state-apis").
-->
<!--frFR:
    "yarn check" vérifie les types et lance le linter, "yarn
    serve:&lt;name&gt;" construit le proxy et le lance avec l'une des
    configurations de "examples/" ("headers", "random", "simple" ou
    "state-apis").
-->
