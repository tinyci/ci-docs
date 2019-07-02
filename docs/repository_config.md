---
id: repository_config
title: Repository Configuration
---

Assuming you have configured your services properly and booted them,
configuration of your first repository will be the next step.

## Configuration Instructions

First things first, we need to create some configuration files in the
repository. Create a file called `tinyci.yml` at the root of your repository,
and leave it blank for now.

Create another file at the root called `task.yml`. Let's put this in there for
now, but don't fret; we'll edit it in a minute.

```yaml
mountpoint: '/myrepo'
runs:
  ls:
    command: ['ls', '-laRt', '/']
    image: 'ubuntu:18.04'
```

This `task.yml` simply says that:

1. this test run requires the `ubuntu:18.04` image
1. Your source code will be mounted in the `/myrepo` directory.
1. The command to be run is `ls -laRt /`. It is specified in
   array format, where an array is established containing each independent
   parameter, to avoid the need for shell quoting. If you wish to use the shell
   instead, just populate this with something like: `[ 'bash', '-c', 'command...' ]`.

Ok, add these files to your repository and push them to your `master` branch on
Github.

### Adding the repository to CI

In the UI, there is an "Add to CI" button near the top:

<img src="/img/screenshots/add-to-ci.png" />

After clicking it, you will see two buttons near the top of the pop-up menu:

<img src="/img/screenshots/add-actions.png" />

The one on the right will upgrade your Github token so we have the power to
populate hooks and perform other administrative actions on your repository.
**If you have not clicked this button, the rest of this tutorial will fail to
work**. Click the button which will redirect you to the homepage.

Click "Add to CI" again and then click the button on the left. This will
download your repository list from Github for searching.

Type in the name of your repository in the search box to find it:

<img src="/img/screenshots/add-search.png" />

Then click the `+` next to the specific item.

This will _automatically_ add the necessary webhook to Github when the add
operation completes; a randomized hook secret is also generated in the
populated webhook; our `hooksvc` validates that against the local database's
record.

### Test the run

Submitting a run is the best way to see it work, so let's do that. At the top
of the UI there is a submit button. Click it:

<img src="/img/screenshots/submit.png" />

It takes a Github `owner/repo` syntax name and a 40-char SHA **or** branch name.

So type in your repository's name and branch into the Submit dialog. If you
check the box nothing will change for now; that's the `test all` override and
we'll talk about it later.

Click the arrow to perform the submission, which takes a moment as we talk to
Github. You do not need to wait for it to use the UI or navigate to other
pages.

<img src="/img/screenshots/submit-dialog.png" />

Once the submission succeeds, a queue item will appear in the task list, you
can drill down into that by clicking the `1` in the runs field to see the runs:

<img src="/img/screenshots/task-queued.png" />

<img src="/img/screenshots/run-queued.png" />

You'll need to start a [runner](runner.md) at this point to reach the next two
steps. This runner will execute your job for you, now that it's in the queue.

While it's running, and once it's done that you'll see status updates, like so:

<img src="/img/screenshots/run-completed.png" />

Note the green "PASSED" label and also take note of the button on the right --
the grey one with a number on it. Clicking this will take you to the log file
and other stats about that specific run. The logs are delivered as they arrive;
once the run starts, the log is available and stream to your browser, but in
this case, this likely happened much faster than you had time to notice and
react.

The log page:

<img src="/img/screenshots/ui2.png" />

### Modifying the run to do something useful

Ok, let's make the run do something interesting. Let's add a small go program
to our repository:

```go
package main

import (
	"math/rand"
	"os"
	"time"
)

func main() {
	r := rand.New(rand.NewSource(time.Now().Unix()))

	time.Sleep(r.Intn(10) * time.Second)

	if r.Int()%2 == 0 {
		os.Exit(0)
	}

	os.Exit(1)
}
```

And modify our `task.yml` like so:

```yaml
mountpoint: '/go/src/github.com/me/myrepo'
runs:
  random:
    command: ['go', 'run', 'main.go']
    image: 'golang:1.12'
```

This creates a run called `random` which runs the command `go run main.go`.
Your code is mounted at `/go/src/github.com/me/myrepo` and the `$GOPATH` is
configured to use `/go` by default in the `golang` docker image used.

Note that this program's only output is the exit status in the event it is
non-zero; for successful runs, it will print nothing.

The go program itself will fail half the time statistically, so if we submit a
lot of runs, we see some runs both pass and fail. It will sleep for a random
duration as well to allow you to see tinyCI's reactions to changes and try out
things like cancellation and auto-cancellation from a new push.

Let's commit this change. We can either submit a pull request from a fork or
non-master branch, or push directly to master to trigger tests.

Please check the next section out for a full listing of controls in `task.yml`
and `tinyci.yml`.
