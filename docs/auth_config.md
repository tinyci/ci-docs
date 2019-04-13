---
id: auth_config
title: Configuring the Authentication Settings
---

The `auth:` section contains several values related to managing the control
plane specifically for uisvc. None of the settings get treated specially by
other services.

## Example

```yaml
auth:
  no_auth: false # disable oauth and use a single account.
  no_modify: false # turn off all UI control of the management plane
  no_submit: false # block submits through the UI
  github_token: '<your token>' # required in no_auth mode
  session_crypt_key: '84f678cd3939cb0b6fe7c03d98b8c49409b79c437eb75131bc0faa40eb858cb3'
  token_crypt_key: 'af77787f8cbeb18204a6825b21191b1d60c53171d5fb22878ad8d907ea8629c2'
```

## no_auth

Turn on ["No Auth" mode](auth_modes.md). Be aware that `github_token` at
minimum must also be set for the service to start.

## github_token

The github token to use for all incoming traffic instead of the tokens normally
reaped at oauth time per user. Creates a user that is the user owning the
github token. The token must be created beforehand; and must have full `repo`
access to the repositories you wish to manage with tinyCI. The [UI](clients.md)
must still be used to manage repository hooks just like with a normal user
workflow.

## session_crypt_key

The session crypt key is the key used to encrypt and decrypt session tokens.
**The uisvc will not boot without this set**. This string is presented in
hexidecimal format, and being an AES key must resolve to 8, 16, or 32 bytes
after being converted. This script can be used to generate the key:

```text
xxd -ps -l 32 /dev/urandom | perl -e 'undef $/; print join("", split(/\n/, <>))."\n";'
```

If this key is lost or it is compromised, regenerate it. Users will need to
talk to github again to get a new session key but should otherwise be fine.

## token_crypt_key

Currently, this value must be provided to all services. Soon it will just be a
function of a few services, so this behavior will change.

The key is generated in the same fashion as the `session_crypt_key`.

This value is used to encrypt the Github secrets captured from OAuth
challenges. They are stored in the database encrypted with the key in this
fashion, and the various services use the key to decrypt it.

## no_modify

This turns off all write effects from the control plane; namely the `uisvc` and
the effect the various clients leverage such as:

- Adding a repository to CI
- Removing a repository from CI
- Managing subscription lists

## no_submit

This disables the submission dialog in the UI, and the functionality of
`tinycli submit`. It is an all-or-nothing setting for now.
