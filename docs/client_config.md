---
id: client_config
title: Client Configuration
---

Configuring the clients requires [some knowledge of the services first](overview.md).
After understanding what each service does and how it fits into the pipeline,
you will be more informed as to how you wish to scale and manage those
services.

Please keep in mind any [TLS configuration](tls_authentication.md) will
necessarily need to be managed in the [service configuration](service_config.md)
as well.

## Example

```yaml
clients:
  logsvc: 'localhost:6005'
  datasvc: 'localhost:6000'
  queuesvc: 'localhost:6001'
  assetsvc: 'localhost:6002'
```

For now accept that each service runs on the following ports. These will be
configurable in the future.

- datasvc: 6000
- queuesvc: 6001
- assetsvc: 6002
- logsvc: 6005
- uisvc: 6010 -- but no internal services query the uisvc.

## TLS configuration

Clients may optionally configure [TLS Authentication](tls_authentication.md)
for servers that require it. To do this, add a `tls` key with some
sub-parameters inside the `clients` section, like so:

```yaml
clients:
  tls:
    ca: /var/ca/rootCA.pem
    cert: /var/ca/localhost-client.pem
    key: /var/ca/localhost-client.key
  datasvc: 'localhost:6000'
  queuesvc: 'localhost:6001'
  assetsvc: 'localhost:6002'
  logsvc: 'localhost:6005'
```

Please note if a client fails to connect it will typically not result in a
server error -- you must diagnose this by reading the logs.
