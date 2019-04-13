---
id: queues
title: Named Queues
---

Named Queues are a scoping & routing mechanism for CI runs. Each run can be
assigned to _write to_ an independent queue as well as each runner can be
assigned to _read from_ a queue. The queue names are arbitrary and are intended
to reflect your needs from a visibility standpoint as to what you are running
the run on.

This mechanism allows you to direct runs to resources based on the name of the
submitter and listener lining up.

Here's a small example of a `task.yml` that has runs that use different queues.

```yaml
---
mountpoint: '/foo'
runs:
  queueOne:
    command: ['cat', '/proc/cpuinfo']
    image: 'foo'
    queue: 'one'
  queueTwo:
    command: ['cat', '/proc/cpuinfo']
    image: 'foo'
    queue: 'two'
  queueThree:
    command: ['cat', '/proc/cpuinfo']
    image: 'foo'
    queue: 'three'
```

Finally, let's presume that each one of the queues has at least one runner
listening on each of the queue names. You can see how these are configured in
the overlay runner [here](runner.md#configuring-it).

In effect, we're listing the CPU properties of each VM or environment that the
queue is listening on. Assuming the command is executed and the image is
constant, the only thing that really differs here is _how the run is launched_,
which is determined by the runner listening on the queue.

So, if one is an x86 Intel, another a Ryzen chip, and a third an ARM, these
will all yield independent logs (and in parallel assuming they're not busy
already) about the processor architectures the runner occupied.

Careful use of named queues can result in many successes in hybrid repositories
or CI environments in general, where resources may be different for the ideal
test case. This way it's not necessary to have to leave a 128GB metal server
lying around to deal with your database throughput tests and end up having it run
simpler things like linters all day. Other repositories can also use these same
resources if they are tied to the same CI system transparently, allowing for
more hybrid utilization between teams.

Because of the exploitative properties of using named queues in public
environments, we have adopted a number of overrides and constraints the set in
the `tinyci.yml` file which is read differently from other files. You can read
more about it in our [configuration guide](repository_properties.md#tinyciyml-global-configuration).
