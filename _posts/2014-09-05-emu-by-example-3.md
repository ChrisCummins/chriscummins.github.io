---
title: Emu by example, part 3
banner: /img/banners/birmingham-5.jpg
---

#### Part 3: Verify and checkout

Now that we know how to create
[sinks and sources]({{ site.baseurl }}{% post_url 2014-09-03-emu-by-example-1 %}) and
[push snapshots]({{ site.baseurl }}{% post_url 2014-09-04-emu-by-example-2 %}), we will demonstrate in
this tutorial how to validate your backups and restore them.

###### verify

Continuing from where we left off, we have a test source with some
junk data and a sink with 10 snapshots. Now, we're going to see how we
can check these snapshots to make sure that they haven't been modified
or corrupted. To do this, we're going to use `verify` command, and
introduce some new syntax.

The `verify` command accepts individual snapshots as arguments. This
means that you have exact control over which snapshots you would like
to verify, and that means we need a syntax for specifying
snapshots. The first and most simplest way is to just name the sink,
as this will verify every snapshot that the sink has:

```
$ emu verify origin
origin:540b4e9b2f16b25fb1c7fa2e2f50dd6d7a9dc39e ok
origin:540b4e9a2f16b25fb1c7fa2e2f50dd6d7a9dc39e ok
origin:540b4e992f16b25fb1c7fa2e2f50dd6d7a9dc39e ok
origin:540b4e982f16b25fb1c7fa2e2f50dd6d7a9dc39e ok
origin:540b4e972f16b25fb1c7fa2e2f50dd6d7a9dc39e ok
...
```

What the `verify` program has done is to recompute the checksum of a
particular snapshot, and check that this matches the checksum that was
created when the snapshot was first made. The algorithm used to create
the checksum is a topic for another time, so for now we just need to
know that if a snapshot is modified or tampered with, this
verification will fail. Let's do that now by adding an unwanted file
to one of our snapshots:

```
$ echo "woops" > "../sink/2014-09-06 18.12.43/bad-data"
$ emu verify
origin:540b4e9b2f16b25fb1c7fa2e2f50dd6d7a9dc39e bad
origin:540b4e9a2f16b25fb1c7fa2e2f50dd6d7a9dc39e ok
origin:540b4e992f16b25fb1c7fa2e2f50dd6d7a9dc39e ok
...
```

Now we see that the verification for that snapshot failed. Running
`verify` periodically on a sink is enough to reassure yourself that
your backups are safe and unmodified. Anyway, back to the syntax. You
see in the output of verify that it pairs up snapshots in the form
`<sink>:<id>`. We can use this to specify snapshots, e.g.:

```
$ emu verify origin:540b4e9a2f16b25fb1c7fa2e2f50dd6d7a9dc39e
origin:540b4e9a2f16b25fb1c7fa2e2f50dd6d7a9dc39e ok
```

We can do this for multiple snapshots. There are two further useful
short-hands for specifying snapshots. The first is `HEAD`, which
evaluates to the ID of the sink's HEAD:

```
$ emu verify origin:HEAD
origin:540b4e9b2f16b25fb1c7fa2e2f50dd6d7a9dc39e bad
```

This is identical to the git HEAD alias, and accepts the same **tilde
notation** for specifying previous snapshots. For example, to verify
the current HEAD's parent, you would use `origin:HEAD~`. To specify
*that* snapshot's parent, use `origin:HEAD~2`, etc.

There is also a `TAIL` alias which expands to the last snapshot in a
sink, which works in exactly the same way as HEAD, except that the
tilde notation counts **backwards** from oldest to newest. E.g. the
second to last snapshot in sink origin is `origin:TAIL~`, and the one
after that is `origin:TAIL~2`, etc.

The second short-hand technique for specifying snapshots is to use
**branch** notation. To specify a *branch* of snapshots (e.g. a
snapshot and every one of its parents), append the snapshot ID with
two dots (`..`). E.g. to verify every snapshot *except* the most
recent one, use `origin:HEAD~..`. To select the last five snapshots in
sink origin, use `origin:TAIL~4..`.

###### checkout

Now we cover what is arguable the most important component of a backup
system: how to restore a backup. Of course a user may choose to
transfer individual files from a snapshot at any time (the beauty of
having a transparent backup system), but to restore an entire source
to the state of a snapshot, the `checkout` command can be used.

To checkout a snapshot, you simply need to use the command `checkout <snapshot-id>`. For example, to restore the state of a source to the
second most recent snapshot on origin:

```
$ emu checkout origin:HEAD~
Checking out origin:54121daf9f2b744570e8240ca43a483956f27056
sending incremental file list

sent 70 bytes  received 12 bytes  164.00 bytes/sec
total size is 0  speedup is 0.00
origin: HEAD at 54121daf9f2b744570e8240ca43a483956f27056
Source restored from 2014-09-11 22.09.51
```

That's all there is to it. The `checkout` program uses exactly the
same file transfer process as `push`, only in reverse. Notice that
`checkout` will set the HEAD to point out to whatever snapshot you
just checked out.

You should be able to get by 90% of the time with just the commands
we've already covered. In Part 4, we'll cover the more exotic `squash`
and `prune` commands, for performing more advanced backup
administration.
