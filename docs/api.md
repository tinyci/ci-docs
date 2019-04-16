---
id: api
title: API
---

## Generated Documentation

- [`uisvc` API (swagger)](/swagger/index.html)
- [GRPC services API](/grpc/)

## Swagger API Extensions

tinyCI defines several swagger 2.0 extensions to the API, to indicate several
additional data points that the swagger spec does not manage.

- `x-capability`: this is a hook into our capabilities system; if the
  capability is assigned to the user (it's just text, but are constants in
  [ci-agents](https://github.com/tinyci/ci-agents)'s `model/user.go`), the API
  call will proceed. If not, a 500 and an error indicating that the capability
  did not exist will be returned.
- `x-websocket`: This value may be `read` or `write` depending on the direction
  of the socket. This indicates that this API endpoint is a websocket; it must
  return a status of 101 if so, otherwise our code generator will be confused. :)
