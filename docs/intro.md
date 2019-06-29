---
id: intro
title: Intro
---

# Demo environment

This is a step by step guide which shows how to bring up tinyCI in a virtual
environment based on Vagrant. This demo will work on OS X or Linux.

The virtual machines are only accessible from the host. As a result, you cannot
accept submissions from github directly, but can currently manually submit repositories to tinyCI for testing.

## Installing the Demo

Check out
[tinyci/ci-demo](https://github.com/tinyci/ci-demo/blob/master/README.md) for
an easy-to-install demo. Follow the instructions in that README, and return
here.

**Please note**, if you did not properly customize the demo with the `customize.rb`
script, you may not be able to see the "Add to CI" or "Submit" buttons
referenced below. (Permissions issue). If you made a mistake, just fix it and
restart the demo so it can reconfigure everything.

## Setting up a Repository

Setting up a repository can be performed by clicking the "Add to CI" button at
the top of the screen.

After clicking that, click the icon of people. (These have tooltips to describe
what they do.) This will "upgrade" your oauth scopes with Github so that you
can perform CI additions which require admin authorization with Github to add
hooks, etc.

After that, click the "cloud" icon next to it. This will scan your repositories
for available targets to add to CI. This process can take a little bit; there
is a notification which will stay on the screen until the operation
completes.

Once you've done that, you can search and click the "+" symbol next to the
found repositories to add them to CI.

## Adding the right files to your repository

First: add an empty file named `tinyci.yml`. This file is always read from the
parent's master, and typically contains overrides that the administrators don't
want the pull requesters to dink with. This file is **required**.

Second: add a file named `task.yml` at the root. Put this in it for kicks:

```yaml
mountpoint: '/tmp'
runs:
  ls:
    command: ['ls', '-laRt']
    image: 'ubuntu:18.04'
  catcpu:
    command: ['cat', '/proc/cpuinfo']
    image: 'debian:latest'
  catmem:
    command: ['cat', '/proc/meminfo']
    image: 'centos:latest'
```

This will run three tasks:

- `ls`, will run `ls -laRt` on an `ubuntu:18.04` image.
- `catcpu`, will run `cat /proc/cpuinfo` on a `debian:latest` image.
- `catmem`, will run `cat /proc/meminfo` on a `centos:latest` image.

Each one will have its own log, separate run, and other stats and statuses
associated with it.

Commit this file to any branch of your repository and push it to github, but
make note of the branch.

## Finally, Submit!

Once you've added a repository to CI, you can submit it, or **any of its
forks** for testing. This is controlled by a capability system, but the demo
automatically enabled those for you.

Note that tinyCI also accepts pull requests, but the demo is incapable of
demonstrating them at this time. Read the docs for more information on how to
set up the `hooksvc`. Demo support coming soon!

1. Click the "Submit" button at the top.
1. Fill out the form. Enter the name of the repository without the github.com
   component (just `tinyci/ci-agents`, for example) and then enter the SHA or
   branch name you want to test. Checking the "Test All" button is irrelevant
   right now.
1. Click the arrow to continue.

After a second or two, your runs should appear as a single task in the list.

## Seeing what's there

Once you've got some runs showing up as a task in your task list, you can click
the blue numbered button to dive into the run list. Each run will have a name,
status, completion time and log button. Click the log button.

The log displays status of the individual run as well as the actual output from
the program. The log is xterm-compatible and spools out to the user over a
websocket, so they will see logs as they arrive.

## That's it!

If you want to take a next step; then replace some of those `task.yml`
definitions with real tests!
