---
id: service_config
title: Service Configuration
---

Rounding off the configuration file is a number of important parameters that
live at the top-level of the configuration file.

## TLS Server-side Configuration

TLS configuration is similar to the [client configuration](client_config.md),
only server-side certs are used instead of client ones. The `tls` key at the
top-level of the configuration file determines this for the service, instead of
the client.

### Example

```yaml
---
tls:
  ca: /var/ca/rootCA.pem
  cert: /var/ca/localhost-server.pem
  key: /var/ca/localhost-server.key
```

## Database configuration

The `db` key controls the connection parameters used to access the PostgreSQL
database accessed primarily by the `datasvc`. Other services do not use this
value. The value is a PostgreSQL [connection string](https://www.postgresql.org/docs/10/libpq-connect.html#LIBPQ-CONNSTRING).
We do not support URIs.

### Example

```yaml
db: 'host=localhost database=tinyci user=tinyci password=tinyci'
```

## uisvc Parameters

The uisvc has a number of parameters which are isolated to this service:

### Websockets

Setting the following configuration will allow `ws://` URLs to work
appropriately, and removes CORS validation against the UI. This is desirable in
certain development and internal configurations.

```yaml
websockets:
  insecure_websockets: true
```

Under the `services` free-form section, uisvc also takes a parameter called
`last_scanned_wait`: it takes a [go duration](https://golang.org/pkg/time/#ParseDuration) as a value and it
determines how long to wait before initiating a fresh repository scan of users
who are capable of adding repositories.{

```yaml
services:
  last_scanned_wait: 1h
```

## assetsvc logs path

Under the `services` free-form section, assetsvc has a key for programming the
logs path where log work and storage will be performed. This path is defaulted
to `/var/tinyci/logs`.

```yaml
services:
  logs_root_path: /tmp/logs # for example
```

### URLs

```yaml
hook_url: 'https://dogfood.tinyci.org/hook'
url: 'https://dogfood.tinyci.org'
```

These two parameters control URLs that are re-used throughout the uisvc:

- `hook_url` is the URL populated into each webhook after adding the repository to CI.
- `url` is the pointer to the React UI.

### Logging

Setting `log_requests` to true can allow you to see all requests, not just
errors. These logs are piped to the `logsvc`.

```yaml
log_requests: true
```

### Tracing

Tracing is currently provided by [jaegertracing](https://jaegertracing.io) and
can be enabled by setting the [environment variables](https://github.com/jaegertracing/jaeger-client-go#environment-variables)
related to the host and port of your Jaeger collector and setting
`enable_tracing` to `true in the configuration. Tracing support is currently
very primitive, and we're planning to expand on it soon.
