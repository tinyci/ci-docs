---
id: intro
title: Intro
---

#### Demo environment

This is a step by step guide which shows how to bring up tinyCI in a
virtual environment based on Vagrant. This makes it easy to try tinyCI.

The virtual machines are only accessible from the host.

A single port must be forwarded to enable hook delivery.

#### Requirements

The host machine must run macOS or Linux. This setup has been tested
only on Linux and macOS.

The latest version of Vagrant must be downloaded and installed. It can
be found at the [Vagrant download page](https://www.vagrantup.com/downloads.html).

VirtualBox 5.2 or newer is needed. VirtualBox
can be found at the [VirtualBox download page](https://www.virtualbox.org/wiki/Downloads).

git will be used to clone the repository which contains the scripts
and other required files.

ngrok will be needed if no other TLS enabled HTTP tunnel is set up.

#### Security considerations

This guide describes a setup which avoids transmitting tokens and
credentials to third parties and in the clear. This is done by
splitting hook delivery from the handling of redirects for OAuth
authentication.

Hooks delivered for events may still contain sensitive details related
to the tested repositories. A secure HTTPS tunnel should be set up if
revealing any data related to the tested repositories is undesirable.

ngrok can be used for hook delivery for a proof of concept environment
which doesn't have such requirements.

#### Clone the repository

The configuration files and scripts must be available for the next
steps.

```
# open a terminal and clone the ci-demo repository
$ git clone https://github.com/tinyci/ci-demo
$ cd ci-demo
```

#### OAuth

A GitHub OAuth application must be created to allow tinyCI to use the
GitHub APIs.

The OAuth application must have the following configuration:

Homepage URL: http://192.168.50.5:3000/

Authorization callback URL: http://192.168.50.5:3000/uisvc/login


This ensures that GitHub redirects to the URL which is accessible only
from the local machine.

The other fields don't have an impact on functionality.
<img src="/img/screenshots/tinyci-app-github.png" />

The client ID and the client secret will be used for tinyCI's config
file.

More details about OAuth and tinyCI can be found in the [oauth](oauth)
section of documentation.

#### Hook delivery

GitHub uses hooks to deliver notifications for a variety of events.
This event delivery requires an URL where these notifications can
be posted. The URL must be accessible over the Internet.

ngrok makes it possible to bring up a reverse tunnel with TLS. Such a
tunnel is needed to enable GitHub to deliver its hooks to the
tinyCI installation which runs on virtual machines.

ngrok should be set up and available on the localhost.

The following command will run a script which sets up the ngrok tunnel:

```
$ ./set_up_ngrok
```
This command will print an URL when it's done. https://abcde12345.ngrok.io
is an example URL which is similar to what this script will print once
it's done running. The URL printed by the script will be needed later
for the tinyCI config file.

The script will stop and print errors instead of the URL if it fails.
ngrok must be debugged, started and the above command needs to be run
again to set up the tunnel.

#### Prepare the configuration file

The following config file must be updated and saved as services.yaml
within the ci-demo directory.

The following variables must be set inside the config:
```
session_crypt_key: must be generated
token_crypt_key: must be generated
client_id: the client ID provided by GitHub when creating the app
client_secret: the client secret provided by GitHub when creating the
app
actualgithubuser: must be replaced with an actual GitHub user
hook_url: must be replaced with the URL provided by ngrok; the /hook
suffix must be left as it is
```

The session_crypt_key and token_crypt_key can be generated using the
following command:
```
xxd -ps -l 32 /dev/urandom | perl -e 'undef $/; print join("", split(/\n/, <>))."\n";'
```

More details about these keys can be found in the [auth config](auth_config)
section.

services.yaml template:
```
auth:
  no_auth: false
  session_crypt_key: 1234567890replacewithgeneratedkey
  token_crypt_key: 1234567890replacewithsecondgeneratedkey
  fixed_capabilities:
    actualgithubuser:
      - 'modify:user'
      - 'modify:ci'
      - 'submit'
      - 'cancel'
oauth:
  client_id: "1234replacewithgithubclientid"
  client_secret: "1234replacewithgithubclientsecret"
  redirect_url: "http://192.168.50.5:3000/uisvc/login"
clients:
  datasvc: 'localhost:6000'
  queuesvc: 'localhost:6001'
  assetsvc: 'localhost:6002'
  logsvc: 'localhost:6005'
services:
  last_scanned_wait: 1m
  logs_root_path: /var/tinyci/logs
websockets:
  insecure_websockets: true
db: 'host=localhost database=tinyci user=tinyci password=tinyci'
hook_url: 'https://abcde12345.ngrok.io/hook'
url: 'http://192.168.50.5:3000'
log_requests: true
```

#### Download a binary release

A binary release of tinyCI needs to be downloaded and put in the
ci-demo directory.

The latest release can be found at [tinyCI releases](https:/github.com/tinyci/tinyci/releases).
The downloaded release must be saved as release.tar.gz.

#### Bring up the environment

The last step is to start the virtual machines and bring up the
environment.

```
$ make provision
```

This command can be run again if an error is encountered.

#### Log in and add the first repository

The next step is to open the tinyCI web UI found at http://192.168.50.5:3000.

The login screen should be displayed in the browser if the tinyCI instance
has come up successfully.

<img src="/img/screenshots/login.png" />

You can log in and continue to read about the [repository configuration](repository_config).
