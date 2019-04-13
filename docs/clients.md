---
id: clients
title: TinyCI Clients
---

TinyCI has two official clients: the React UI and `tinycli`.

## React UI

`<josiah or eric to fill in here>`

## tinycli

`tinycli` is a command-line client that works anywhere
[golang](https://golang.org) does.

The rest of this section covers the bootstrap and usage of the tinycli tool.

### Getting a release

Releases can be found on the [ci-agents releases page](https://github.com/tinyci/ci-agents/releases). Download the correct
version for your platform, and enjoy.

### Generating a client token

To work with `tinycli`, you need to generate and store your `uisvc` token. To
do this you use the `init` subcommand:

```text
$ tinycli init
```

### Using tinycli subcommands

tinycli uses a familiar git-like subcommand interface; to see what subcommands
are available, type `tinycli --help`. To see the help for a specific command,
type `tinycli help <subcommand>`.

```text
$ tinycli --help
NAME:
   tinycli - tinyCI CLI

USAGE:
   tinycli [global options] command [command options] [arguments...]

VERSION:
   1.0.0 (tinyCI version 0.1.0)

DESCRIPTION:
   Commandline client to control tinyCI

COMMANDS:
     init, i    Initialize the client with a token and endpoint URL
     submit, s  Submit a job to tinyCI
     runs, r    List runs
     log, l     Show a log by Run ID
     help, h    Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --help, -h     show help
   --version, -v  print the version
```

```text
$ tinycli help submit
NAME:
   tinycli submit - Submit a job to tinyCI

USAGE:
   tinycli submit [command options] [parent or fork repository] [sha]

DESCRIPTION:
   Submit a job to tinyCI

OPTIONS:
   --all, -a  For a test of all task dirs, not just diff-affected ones
```
