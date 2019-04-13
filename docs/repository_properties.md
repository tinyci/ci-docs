---
id: repository_properties
title: Repository Configuration Properties
---

This document covers the configuration properties that `tinyci.yml` and
`task.yml` use.

## tinyci.yml (global configuration)

`tinyci.yml` is a single file that lives at the root of the repository. **It is
always read from the master branch of the parent**, allowing you to control
these settings more tightly instead of a pull request triggering this
information's updating.

The format largely consists of overrides and default settings for things such
as timeouts.

- `workdir`: a global default workdir. Does not affect mountpoints for each task.
- `queue`: the default queue to use. Otherwise, the queue name is `default`.
- `override_queue`: Force a queue even if it's different in `task.yml`. This
  can keep misuse of `task.yml` at bay.
- `global_timeout`: Run timeout. If this is unset, there is **no timeout** and
  runs can run forever if a timeout is not explicitly specified.
- `override_timeout`: Override the run timeout for all `task.yml` run
  definitions.
- `ignore_directories`: a list of directories, relative to the root, that are
  omitted from `task.yml` scanning. `vendor` is a good choice for golang
  packages that are extending tinyCI.
- `metadata`: metadata to be folded into run metadata. It will not override any
  data existing in the run, unless the setting `override_metadata` is true.
- `override_metadata`: If set, it will make the metadata in this file take
  precedence over any run metadata. Useful for controlling bad actors.

## task.yml (directory configuration of tests)

`task.yml` is the unit that defines runs to add to the queue. It contains items
to manipulate and manage the directory and the runs associated with it.

- `mountpoint`: the point at which to mount the repository. `workdir` will be
  set to the same unless it is set independently, or through `tinyci.yml`.
  **This field is required**.
- `env`: array of string; these are environment variables to pass through to
  the queue for processing by the runner. They are specified in
  [environ](https://linux.die.net/man/7/environ) syntax: `FOO=1` for example.
- `dependencies`: a list of directories to add to the queue if this directory is
  processed during diff selection.
- `workdir`: the directory to start the container in, will execute all runs from this point. Defaults to the mountpoint.
- `default_timeout`: Timeout to use in the event one is not set on the run.
- `default_queue`: Queue to use in the event one is not set on the run.
- `default_image`: Image to use in the event one is not set on the run.
- `metadata`: arbitrary mapping of data; can be processed by supporting runners.
- `runs`: See below, this is the definition of runs for the directory.

### Run definitions

Runs are a mapping of name (string) to another table of settings called "run
settings". This is inside the `task.yml` under the `runs` key, like so:

```yaml
---
mountpoint: '/go/src/github.com/tinyci/ci-agents'
runs:
  dist:
    command: ['make', 'do-build']
    image: 'tinyci/ci-agents'
  checks:
    command: ['bash', 'checks.sh']
    image: 'tinyci/ci-agents'
  staticcheck:
    command: ['make', 'staticcheck']
    image: 'tinyci/ci-agents'
```

Each parameter is described below.

- `command`: array of strings that will be used in an
  [execve()-like fashion](http://man7.org/linux/man-pages/man2/execve.2.html).
  Each parameter is a literal value; it is not processed by a shell or similar
  templating entity. If you wish to use a shell, try: `[ "bash", "-c", "my command" ]`.
- `image`: an arbitrary image name. Depends on which runner you will use to
  determine what this means; in the `overlay-runner` case this is a docker
  image.
- `queue`: Queue to use. Queues are named and runners are expected to listen on
  them. A job that fires into a queue without any listening runners will
  succeed filing, but **will never complete**. Setting up your runner
  configuration with queues is discussed in the
  [Installation Guide](installation.md).
- `metadata`: Runner-specific metadata. If this is provided, it is injected
  into the queue verbatim and passed to runners for further processing.
- `timeout`: the time to wait before killing the run, in
  [golang duration format](https://golang.org/pkg/time/#ParseDuration).
