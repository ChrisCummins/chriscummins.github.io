---
title: Emu by example, part 1
banner: /img/banners/vik.jpg
---

#### Part 1: Sinks and sources

Before we dive into the tutorial, we must establish some
terminology. There are three main concepts in emu: sources, sinks, and
snapshots.

A **source** is a source of data which you wish to backup, e.g. a
documents folder, or media library.

Each source can have one or more **sinks**, which are the backup
destinations, e.g. a separate partition, or a network file share.

A **snapshot** is the fundamental unit of backups: an exact copy of a
source at a single moment in time. Each sink may have multiple
snapshots. Emu is a rotating snapshot program, that is, as a sink
collects more and more snapshots, the newer snapshots displace the
older ones.

Since emu is modelled closely on git, the three emu components can be
analogised to git concepts: **sources** are like git **repositories**,
**sinks** are like **remotes**, and **snapshots** are like
**commits**.

Emu is an incremental snapshot program. As such, each snapshot has a
parent snapshot, and by iterating along a chain of snapshot parents, a
branch is created. Branches are similar to those in git, except for
the main difference that there is only one named branch pointer, which
always points to the current HEAD. So while it is possible to create
branch histories of arbitrary complexity, you will have to track the
IDs of each branch head yourself, instead of having named branches
like the familiar "master". Additionally, snapshots may only have one
parent, so branches cannot be merged. These restrictions are the
result of intentional decisions to emphasise emu's primary purpose of
creating *backups* - it is not version control.

###### init

OK, so enough with the theory, let's crack open the terminal! First,
lets create a testing area, which we'll use as a *source*.

```
$ mkdir /tmp/source
$ cd !$
```

The first emu command we'll come across is `init`.

```
$ emu init
Initialised source at '/tmp/source'
```

It's worth point out here that all emu commands are to be executed
from within the *source* directory. If we want to execute an emu
command from outside of a source, we can specify the source path using
the `-S` flag:

```
$ emu init -S /tmp/source
Initialised source at '/tmp/source'
```

In both cases, the end result is the same. Emu creates a directory at
the root of the source called `.emu`, and populates it with all the
files it needs to turn the directory into an emu source. Under normal
circumstances, you will never have to poke around inside the `.emu`
directory, but for the sake of this tutorial let's take a look and see
what's happening under the hood:

```
$ ls -l /tmp/source/.emu
total 4
-rw-r--r-- 1 chris chris    0 Sep  4 14:18 config
-rw-r--r-- 1 chris chris 1364 Sep  4 14:18 excludes
drwxr-xr-x 4 chris chris   80 Jul  5 12:56 hooks
drwx------ 2 chris chris   40 Sep  4 23:43 sinks
```

We can see that there is a configuration file, an excludes file, and a
couple of directories. We will cover the hooks directory in a later
tutorial, and the sinks directory is currently empty. This is for the
obvious reason that we have yet to create a sink, so let's do that
now!

###### sink

As mentioned earlier, sinks behave very similarly to git's remotes,
and the `sink` command uses the same syntax as `git remote`. Sources
can support multiple sinks, so they are named. Let's create a test
sink at `/tmp/sink`, called `origin`:

```
$ emu sink add origin ../sink
Initialised sink origin at '/tmp/sink'
```

Again, emu creates a number of files within a `.emu` directory which
enables it to behave like an emu sink. Let's take a look:

```
$ ls -l ../sink/.emu
total 4
-rw-r--r-- 1 chris chris 48 Sep  4 14:18 config
-rw-rw-r-- 1 chris chris  0 Sep  4 23:47 HEAD
drwx------ 2 chris chris 40 Sep  4 23:47 nodes
drwx------ 2 chris chris 40 Sep  4 23:47 trees
```

This time there's even less to see. There's another configuration
file, two empty directories, and an empty file called `HEAD`. If we
were to have a look inside our source's `.emu` directory, we would now
see that there is a single within `.emu/sinks` which has the name of
our sink. If we read it, we see that it simple contains a path which
points to the sink we just created:

```
$ cat .emu/sinks/origin
/tmp/stack
```

We can get emu to list a source's sinks by invoking the `sink` command
without any arguments. Additionally we can use the verbose flag `-v`
to gather more information:

```
$ emu sink -v
origin
Location:        /tmp/sink
No of snapshots: 0
Max snapshots:   10
Head:
Device:          tmpfs
```

While incredibly simplistic, this tutorial has hopefully demonstrated
a key strength of emu: **transparency**. Pointers are just files, data
is stored in plain text, and things aren't wrapped up in unnecessary
complexity. In later tutorials we will cover some of the advanced
features of emu, and in all cases you will see this simplicity applied
throughout the entirety of emu. It is a fundamental part of its
design, and its greatest strength.

OK, so this was a bit of a slow start to our tutorial, but it
introduced the fundamental concepts of **sources**, **sinks**, and
**snapshots**, and showed you how to create two of them. Tomorrow we
will cover snapshot creation! Stay tuned.
