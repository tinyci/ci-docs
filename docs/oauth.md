---
id: oauth
title: tinyCI OAuth
---

tinyCI's auth works against Github OAuth sources; others will be supported in
the future.

The users are created from github oauth tokens that are returned to us after a
successful challenge; all usernames, repository associations and other
CI-related data are created and associated exactly as github would do.

This part of the configuration is controlled with the `oauth:` YAML
configuration section, and looks something like this:

```yaml
oauth:
  client_id: '<your id>'
  client_secret: '<your secret>'
  redirect_url: 'http://<your UI endpoint>/uisvc/login'
```

To get your client information, you can follow the instructions
[here](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)
to create an oauth application to use for your tinyCI installation.

To assign rights to manage the application, read about [capabilities](capabilities).
