---
id: auth_modes
title: tinyCI Auth Modes
---

tinyCI's auth modes change the UI and interactions between the services
dramatically, so it's important to discuss them first.

tinyCI fundamentally has two models of operating against user data: one is via
Github OAuth, and the other is "No Auth" mode.

Please keep in mind that control plane restrictions (such as disallowing adding
new repositories, or manual submissions) are independent of the auth mode;
those controls are disabled in both modes regardless of user connected.

## OAuth mode

In the OAuth scenario, the users are created from github oauth tokens that are
returned to us after a successful challenge; all usernames, repository
associations and other CI-related data are created and associated exactly as
github would do so.

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

## "No Auth" mode

In "No Auth" mode, the concept is similar but only one user is created -- the
one corresponding to the github token provided in the configuration file. This
way there are no users -- but all connecting clients are the same user,
effectively.

"No Auth" mode is off by default; to turn it on, follow through to the
[authentication configuration](auth_config.md) section.
