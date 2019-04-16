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
  session_crypt_key: '84f678cd3939cb0b6fe7c03d98b8c49409b79c437eb75131bc0faa40eb858cb3'
  token_crypt_key: 'af77787f8cbeb18204a6825b21191b1d60c53171d5fb22878ad8d907ea8629c2'
  fixed_capabilities:
    erikh:
      - 'modify:user'
      - 'modify:ci'
      - 'submit'
      - 'cancel'
    bot:
      - 'modify:ci'
```

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

## fixed_capabilities

`fixed_capabilities` is a way of specifying capabilities outside of the DB,
either for recovery of an account, locking down of a specific account in a
specialized way, or other manipulations. Please note that no database traffic
is performed for situations where fixed capabilities are in play -- only the
configuration is consulted.

To supply this, you must supply a map of usernames, corresponded with a list of
capabilities to support for that user. Any omitted ones will be assumed off. In
this event, you will **not be able to enable caps through the control plane**.

Example:

```yaml
auth:
  fixed_capabilities:
    erikh:
      - 'modify:user'
      - 'modify:ci'
      - 'submit'
      - 'cancel'
    bot:
      - 'modify:ci'
```

In this case, we've given the `erikh` user the ability to do a lot of different
stuff, including granting capabilities to other users. The `bot` user on the
other hand, can manage repositories, but perform no other capable actions.

Any attempt to modify the capabilities for either user will be fruitless as
only this configuration will be considered.
