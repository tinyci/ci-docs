---
id: runner_config
title: Configuring the Runners
---

The most used runner is the `overlay-runner`. While no runner really shares
common things like configuration, this document goes into how a runner talks to
the rest of the tinyCI ecosystem, as well as gives a baseline idea of how to
configure a runner.

## About the overlay runner

The overlay runner is a simple runner that:

- Runs one run at a time on a single host.
- Clones your repo to a new repository, or refreshes an existing one.
- Establishes an overlayfs mount atop the source code
- Binds that top level overlayfs mount into docker
- Runs the docker image with the provided command in the `task.yml` file (which
  is assumed to run the actual test).
- After the test is finished, will remove the upper overlayfs levels from disk.

This pattern allows for maximum storage management potential, by:

- Minimizing host level filesystem damage (only the partition can be filled,
  but no permanent damage can be done to the fs). The upper levels of the
  overlayfs are removed after the test finishes, so any fs damage will be
  contained there.
- Limiting re-clones of the repository (repositories are always pristine and
  kept), saving network bandwidth. Forks are kept with the parent as remotes.
- Use (and re-use on fresh runs) of docker images also saves bandwidth
  downloading images.

## Architecture for runner installation

The overlay runner occupies a VM for CI tasks; what the VM looks like is up to
the administrator, but it is strongly recommended that every VM for a given
queue is uniform as much as can be managed. **Each runner VM must have a
working docker installation on it**.

The overlay runner requires **root access** to establish the overlay mounts. In
the future this will not be a necessary limitation.

Each runner will talk to three microservices:

- `queuesvc`: what hands out the items to run.
- `logsvc`: to emit syslog-like logs.
- `assetsvc`: to emit the logs from the CI run.

## Configuring the runner

The runner uses a YAML configuration file that looks very similar to other
config files within the tinyCI ecosystem. It consists of a list of clients
(with optional TLS settings) and a named queue:

```yaml
queue: 'default'
clients:
  tls:
    ca: /var/tinyci/ca/rootCA.pem
    cert: /var/tinyci/ca/tinyci-client.pem
    key: /var/tinyci/ca/tinyci-client.key
  logsvc: 'machine-1.local:6005'
  queuesvc: 'machine-1.local:6001'
  assetsvc: 'machine-1.local:6002'
```

This configures the microservice clients for the runner (with optional TLS
data), and sets up the [queue](queues.md) that the runner will use to receive
data from.

## Managing the overlay runner service

The easiest way to do this is with `systemd`. Check out the following unit file
suitable for running `overlay-runner`.

```ini
[Unit]
Description=overlay-runner
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/var/tinyci/bin/overlay-runner -c /path/to/config/file.yml
WorkingDirectory=/var/tinyci/bin/

[Install]
WantedBy=multi-user.target
```

## Canceling runs

Upon cancel, overlay runner will stop the run immediately and clean up.
Sometimes, due to various circumstances the run will not get canceled in the
UI. `cancelbot` is here to assist with that. Running in `cron`, it can be used
to clean up any runs that clearly aren't running anymore (to avoid noise in the
UI).

## Signal Handling

Signals sent to the overlay runner will manage the underlying run the runner is
working on (if any). The follow signals affect runs in the following ways.

- SIGTERM, SIGINT: cancel running job
