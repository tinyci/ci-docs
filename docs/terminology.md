---
id: terminology
title: Terminology
sidebar_label: Terminology
---

As with most complicated systems, tinyCI comes with its own terminology.
Specifically, every atom in the CI lifecycle has specific names that will be
used throughout the documentation to describe their behavior.

- **Run**: This is the executed job in CI. Runs typically consist of a name, image
  (arbitrary field describing the base operating system to use, does not
  prescribe launch platform), and command, but may incorporate [other
  items](repository_properties.md#run-definitions) as well. Runs are translated to queue items to be
  handed to runners.
- **Task**: a 1:1 mapping of the `task.yml` file format (see the
  [configuration reference](repository_config.md)) and the given directory it's
  contained in. Tasks are groups of runs, and are the fundamental unit of [diff
  selection](diff_selection.md) by intersecting the runs that are configured
  for that directory, with changes that affect the directory.
- **Ref**: refs correspond to [git refs](https://git-scm.com/book/en/v2/Git-Internals-Git-References) but carry
  additional metadata about the state of the run. A full CI run is typically a
  tuple of repository and ref. SHA refs are resolved to branch/tag names whenever
  possible.
- **Runner**: executor of a CI job. Runners are technically anything that
  listens for and accepts an item on a named queue, submits a state at the end of
  the run, and (optional) reports a log while the run is proceeding. Official
  runners are kept in the [ci-runners](https://github.com/tinyci/ci-runners)
  repository.
