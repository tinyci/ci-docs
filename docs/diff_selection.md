---
id: diff_selection
title: Diff Selection
---

Diff selection is a key way to save time within your runs. It leverages the
diffs in your changes to determine what tests need to be run, omitting testing
changes that would otherwise pass and waste time and resources. Diff selection
is only utilized on incoming pull requests.

Two major points about diff selection:

1. _It is completely optional._ If you do not wish to use diff selection, simply
   do not put `task.yml` files in subdirectories in your tree. If you keep only
   one `task.yml` at the root, diff selection will always resolve to that
   file. Everything else will function unabated, including parallel runs.
1. Master _always runs a full, uninterruptible test on any push to it_. This ensures
   your master is tested appropriately.

## How Diff Selection works

Let's say you have a tree of files:

```text
foo/
  task.yml
  source_code.go
bar/
  baz/
    task.yml
    source_code.go
  source_code.go
task.yml
main.go
```

Let's examine it for a minute. In there we have `foo/task.yml`,
`bar/baz/task.yml`, and `task.yml` at the root. This will be keys for the diff
selection algorithm. Inside of each task.yml is [repository configuration](repository_config.md)
relating to the runs _triggered by modifying code in that directory or beneath
it._ The search happens from the diff's perspective, back through dirs towards
the root; stopping at the first found `task.yml`.

So, if you provide a diff that contains these files:

```text
foo/source_code.go
bar/source_code.go
```

Then the following `task.yml`'s would be triggered:

```text
foo/task.yml
task.yml
```

But not `bar/baz/task.yml`, as that would be technically unrelated. If someone
added a change that affected that directory, or a subdirectory of it, then it
would trigger.

## Dependencies

Using the [task.yml property](http://tinyci.local:3010/docs/repository_properties#taskyml-directory-configuration-of-tests)
`dependencies` can go far with dirs that depend on a swath of other things
working as well.

For example, our own tinyCI `datasvc` agent has database routines stuffed in `model/`. In this
case, we need to test our services any time the model is also affected.

So, in our [model/task.yml](https://github.com/tinyci/ci-agents/blob/master/model/task.yml#L7-L11)
you can see that we've added dependencies to those services which transitively
depend on changes to this package.
