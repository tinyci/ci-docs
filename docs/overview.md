---
id: overview
title: Services Overview
---

## Overview of tinyCI services

This document covers the various services that compose tinyCI as well as the
interoperations between many of them. For an exhausive list of
interconnections, look at the [API documentation](api.md).

The services are divided into several roles that pipeline data around to
fulfill those roles. For example, many (but not all) services directly contact
the `datasvc`, the conduit which has the role of talking to the backing store.

The services themselves -- all of them -- are stateless components; they do not
keep state that is necessary beyond the length of the API request. This allows
all services to be globally load balanced, managed in a highly-available
way, and are fully [STONITH](https://en.wikipedia.org/wiki/STONITH)-compatible.

The interconnections allow us to formulate a stack of microservices that have
several leads into the system. Exmaple: The `hooksvc` lives at the edge where
it can be reached by github, but only talks to the `queuesvc`, which is in turn
talking to the `datasvc` and github itself to accomplish its goals. This
distinction means that the `uisvc`, and react UI, do not need to live at the
border along with the `hooksvc`. They are independent binaries and do not even
talk to each other at all.

## Service Lineup

### Runners

Runners are the launcher for most "real" CI operations after all the
data has been shuffled around. See more [about runners here](runner.md). The
basic runner is the `overlay-runner`.

### datasvc

This is the primary service for talking to the database. There is no free-form
query interface; you can ask for the data you need through the client directly.

### uisvc

This provides the HTTP frontend service for the React app and other clients.
This also maintains user authentication to the system. Please note that all
other services are configured with client/server TLS verification.

### hooksvc

The hook service provides replies to github from webhook requests and
additionally programs the `queuesvc` for handling submissions from github
webhooks.

### queuesvc

Manages the queue of items, largely through the `datasvc`. Also manages the
processing of diff selection and the assignment of tasks, runs and queue items
from incoming submission requests.

### assetsvc

Manages the reported assets from the run. Currently only handles logging from
the CI runner.

### logsvc

Centralized logging engine. Logs to stdout via the `sirupsen/logrus` golang
package. Can be replaced trivially to route to splunk, ELK, etc.

## Diagram

This is a visual rough approximation of the stack position of the services as
well as the sister services they share clients with. Basically it's something I
put together on a Saturday night when trying to figure out how to visually
explain this thing. Hope it works.

<center><img src="/img/docs/services-stack.png" /></center>
