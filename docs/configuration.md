---
id: configuration
title: Configuration Guide Introduction
---

This guide covers both configuration of the services as well as covering
configuration of tinyCI-compatible repositories.

tinyCI's configuration files are generic; services are configured in a YAML
format that allows almost all of the services to use the same configuration
file if desired, for ultra-small installations and demos.

For example, this is a suitable configuration for all services at once: they
can all refer to this and be functional:

```yaml
auth:
  session_crypt_key: 1234567123456712345671234567123456712345671234567888888812345678
  token_crypt_key: 1234567123456712345671234567123456712345671234567888888812345678
  fixed_capabilities:
    me:
      - 'modify:user'
      - 'modify:ci'
      - 'submit'
      - 'cancel'
    bot:
      - 'modify:ci'
oauth:
  client_id: '<your id>'
  client_secret: '<your secret>'
  redirect_url: 'http://<your UI endpoint>/uisvc/login'
tls:
  ca: /var/ca/rootCA.pem
  cert: /var/ca/localhost-server.pem
  key: /var/ca/localhost-server.key
clients:
  tls:
    ca: /var/ca/rootCA.pem
    cert: /var/ca/localhost-client.pem
    key: /var/ca/localhost-client.key
  logsvc: 'localhost:6005'
  datasvc: 'localhost:6000'
  queuesvc: 'localhost:6001'
  assetsvc: 'localhost:6002'
services:
  last_scanned_wait: 1h
  logs_root_path: /var/tinyci/logs
websockets:
  insecure_websockets: true
db: 'host=localhost database=tinyci user=tinyci password=tinyci'
hook_url: 'http://my.remote.endpoint.example.com/hook'
url: 'http://localhost:3000'
log_requests: true
enable_tracing: false
```

For larger installations configuration files will potentially be more diverse
and require different configurations depending on how nodes are routed or
otherwise placed.
