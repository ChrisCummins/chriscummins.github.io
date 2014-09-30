---
layout: default
title: Emu by example, part 4
---

#### Part 4: Squash and prune

In the [last post](/posts/emu-by-example-3/) we covered how to
identify snapshots uniquely using their IDs and various shorthand
aliases, and how to verify and checkout individual snapshots. Today
we're going to cover two further important topics: How to merge
snapshots, and how to remove snapshots.

###### squash

The `squash` command accepts multiple chronologically ordered
snapshots as arguments, and squashes each of them together to form a
new, *merged*, snapshot. That is, if we squash together snapshots *A*
and *B*, the resulting snapshot *C* would contain all of the files of
*A* and *B*, without duplicates. Where there are competing files, the
most recent snapshot's file will be preserved. For example, let's say
we wanted to squash the last four snapshots together:

```
$ emu squash origin:TAIL~3..                                           17:27:23
origin: merging snapshot 2014-09-30 17.30.01
origin: merging snapshot 2014-09-30 17.30.02
origin: merging snapshot 2014-09-30 17.30.03
origin: merging snapshot 2014-09-30 17.30.04
origin: merged 4 snapshots
origin: removing snapshot 2014-09-30 17.30.01
origin: removing snapshot 2014-09-30 17.30.02
origin: removing snapshot 2014-09-30 17.30.03
origin: removing snapshot 2014-09-30 17.30.04
origin: new snapshot 2014-09-30 17.30.16
```

The output explains a lot about the mechanics of `squash`. First, it
merges each snapshot in turn into a new one. Once this new snapshot
has been fully merged, the squashed snapshots are removed, and the new
snapshot is inserted into the snapshot history, being assigned an ID
and date. Let's now squash the two most recent snapshots:

```
$ emu squash origin:HEAD origin:HEAD~                                  17:27:23
origin: merging snapshot 2014-09-30 17.30.47
origin: merging snapshot 2014-09-30 17.30.44
origin: merged 2 snapshots
origin: removing snapshot 2014-09-30 17.30.47
origin: removing snapshot 2014-09-30 17.30.44
origin: HEAD at 542ae8cdda39a3ee5e6b4b0d3255bfef95601890
origin: new snapshot 2014-09-30 17.30.53
```

Notice now that since we have created a new snapshot out of the HEAD,
we must assign this new snapshot as HEAD in order to preserve the
snapshot history. Squash is most useful when we want to preserve the
data contained within multiple snapshots, without also preserving the
history of those unique snapshots. The history that is lost is the
differences between the squashed snapshots. Now we're going to take a
look at the `prune` command, which is how we remove history in emu.

###### prune

The `squash` examples have already demonstrated the effects of
`prune`. Pruning a snapshot means simply removing it, and all
associated data, from the backup sink. The most common use case for
`prune` is to simply remove old snapshots that we're no longer
interested in preserving. For example, to remove the five oldest
snapshots from sink origin:

```
$ emu prune origin:TAIL~4..                                            17:27:23
origin: removing snapshot 2014-09-30 17.41.43
origin: removing snapshot 2014-09-30 17.30.53
origin: removing snapshot 2014-09-30 17.30.16
origin: removing snapshot 2014-09-30 17.30.07
origin: removing snapshot 2014-09-30 17.30.06
```

And to remove the most recent snapshot:

```
$ emu prune origin:HEAD                                                17:27:23
origin: removing snapshot 2014-09-30 17.41.59
origin: HEAD at 542aeb59da39a3ee5e6b4b0d3255bfef95601890
```

Notice again how removing the HEAD means that we must set a new
snapshot as the HEAD. This new HEAD is simply the parent of the old
deleted HEAD.

That's it for today. In the final part we'll take a look at the
`clean` command, and the various ways in which emu's behaviour can be
customised. See you then!
