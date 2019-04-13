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
