---
id: runner
title: CI Runners
---

Runners in tinyCI parlance means more or less:

> Anything that accepts an item from the queue, streams a log, and closes that
> queue item with a status report.

This means that functionally, runners can do anything that fits those following
constraints. Runners in a multitude of languages (they need only support
[GRPC](https://grpc.io)) could be programmed to follow this pattern doing the
following things, for example:

_(none of these exist... yet!)_

- Pull machines out of a pre-scaled autoscaling group on AWS, execute tests on
  them, destroy them; and let AWS fill the gap for you in the background.
- Make a build/test pipeline in Kubernetes similar to other CI agents where a
  pod is used to build, and then later run the tests.
- Run on a specialized piece of hardware, testing it from the inside with your
  repository's contents.
- Run on other operating systems like Windows, OS X, Fuchsia, etc in a native
  way to their platform instead of trying to make a Unix thing work on it.

## Using the overlay runner

Our introductory runner is the `overlay-runner`, which can be
found in the [ci-runners](https://github.com/tinyci/ci-runners) repository on
github. This runner is quite simple; runs on a pre-built Linux machine that you design,
but talks to docker and leverages overlayfs to provide a very efficient
mechanism to manage disk pollution and the git repository simultaneously.

If you have the [Golang Toolkit](https://golang.org) installed, this is as easy as:

```shell
go get -u github.com/tinyci/ci-runners/cmd/overlay-runner/...
```

And your file will be in `$GOBIN/overlay-runner` or
`$GOPATH/bin/overlay-runner` if `$GOBIN` is not set.

For a lot of important reasons, overlay-runner runs as _root_. It does not
execute any code itself other than `git` and a small shell script it writes to
help git login to Github. It is expected that this machine will not have anything
else running on it.

To leverage it, compile or install from the
[releases page](https://github.com/tinyci/ci-runners/releases) on a machine
pre-sized for your needs with docker and a capable overlayfs driver.

### Configuring it

`overlay-runner` requires a few parameters, and others can alter its behavior.

This should get you started:

```yaml
---
# hostname is not required.
# this is an override, it will derive it from the gethostname() syscall
# otherwise
hostname: 'test'
# The default queue name is default -- see more below about queue names
queue: 'default'
# these are clients to the services this runner works with.
clients:
  queuesvc: 'localhost:6001'
  logsvc: 'localhost:6002'
runner:
  # path to login script -- will be created and pruned for each clone. Contains github tokens.
  login_script_path: '/tmp/login-script'
  # path to base directory of all github repos. They will be stored in an
  # `owner/repo` directory structure.
  base_script_path: '/tmp/git'
```

### Launching it

To start the `overlay-runner`:

As root:

```shell
overlay-runner -c config.yaml
```

If you have questions about the options or their defaults:

```
overlay-runner --help
```

## On Named Queues

You may have noticed in the configuration example above, that the queue was
named with the tag `default`. This is the default name for queues; all queues
are named but revert to `default` if unspecified.

Named queues can be used to direct CI traffic to separate groups of runners or
configurations of runners. Read more about [named queues here](queues.md).
