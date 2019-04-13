---
id: hooksvc_config
title: Configuration of the hooksvc
---

Unfortunately, right now the hooksvc is special in that it very different from
the rest of the tinyCI ecosystem in how it's built and launched; this is an
artifact of its integration point with Github as a remote caller.

It is the hope of the project to change this and normalize this pattern as
well, soon.

For now, the `hooksvc` has 3 parameters it supports, all endpoints to different
services. Please note none of these services are a URL: they are merely
`host:port` combinations.

```yaml
---
queue_service: 'localhost:6001'
data_service: 'localhost:6000'
log_service: 'localhost:6005'
```
