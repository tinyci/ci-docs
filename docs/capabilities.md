---
id: capabilities
title: User Capabilities
---

## About User Capabilities

Much like [linux capabilities](http://man7.org/linux/man-pages/man7/capabilities.7.html),
tinyCI's capabilities system is the result of a single text token being
assigned to a user; if that token exists, the API call expecting it may
proceed. If not, the call is denied.

Future implementations of capabilities will include roles for users to include
many capabilties in one go. However now, there are only four capabilities:

- `submit`: Allow manual submissions to tinyCI
- `cancel`: Allow cancelling runs.
- `modify:ci`: Allow CI modifications such as adding or removing repositories to/from CI.
- `modify:user`: Allow modifying the capabilities of other users.

## Changing User Capabilities

For starters, make sure the calling user has the `modify:user` capability. If
it does not, all of this will error.

This will be in the UI soon; but for now, install and configure
[tinyCLI](clients#tinycli):

```bash
$ tinycli capabilities add <user> <capability>
$ tinycli capabilities remove <user> <capability>
```

## Setting Fixed Capabilities in the Configuration

Another method of setting capabilities lies in the configuration. If provided
for a user, it will override all capabilities in the database.

See more about [configuring fixed_capabilties here](auth_config#fixed_capabilities).
