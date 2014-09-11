---
layout: default
title: Emu by example, part 2
---

#### Part 2: Push and log

In the [last post](/posts/emu-by-example-1/) we covered the `init` and
`sink` commands in order to initialise an emu source and a sink,
respectively. In this post we will use this sink we have just made to
create our first snapshot!

###### push

Emu doesn't have the staging area or index of git. Instead, snapshots
are created by simply pushing directly to sinks. First, let's create
ourselves a test file that we want to backup.

```
$ cd /tmp/source
$ echo "omg wow" > awesome
```

Once we have created this supremely awesome file which is in critical
need of backing up, we should create our first snapshot. Emu uses
[rsync](http://rsync.samba.org/documentation.html) to perform its fast
delta file transfers, so some of the output will be familiar:

```
$ emu push
origin: pushing snapshot (1 of 10)
sending incremental file list
created directory /tmp/sink/.emu/trees/new
./
awesome

sent 134 bytes  received 89 bytes  446.00 bytes/sec
total size is 8  speedup is 0.04
origin: HEAD at 5408ffe4a34c6074bfb057003516117ae1a25073
origin: new snapshot 2014-09-05 00.12.20
```

OK, so that's a bit more output than with previous commands, let's
dissect it. First, our `origin` sink tells us that it's pushing
snapshot number 1 of 10. Then, we see some fluff about the file
transfer, and it lists all of the files that were transferred (in this
case, our solitary `awesome` file). Finally, we see that our snapshot
has been given the ID `5408ffe4a34c6074bfb057003516117ae1a25073`, and
that the origin sink's HEAD now points to it. This new snapshot has
the name `2014-09-05 00.12.20`.

Snapshots can be identified in one of two ways. Each snapshot has an
**ID**, which is a 40 character hex string containing a checksum and a
timestamp, and a **name**, which is a human readable date string. When
you need to specify individual snapshots to emu, use the ID. The name
is for your benefit.

Now that we have our first snapshot in the bag, let's create another!
This time let's make a slightly larger file:

```
$ dd if=/dev/urandom of=data bs=1000000 count=100
100+0 records in
100+0 records out
100000000 bytes (100 MB) copied, 4.65755 s, 21.5 MB/s
```

Now that we have some junk data, we repeat our old friend `push`:

```
$ emu push
origin: pushing snapshot (2 of 10)
sending incremental file list
created directory /tmp/sink/.emu/trees/new
./
data

sent 100.02M bytes  received 89 bytes  200.05M bytes/sec
total size is 100.00M  speedup is 1.00
origin: HEAD at 540905899bf5695c05aea2cb851309b7b5137007
origin: new snapshot 2014-09-05 00.36.25
```

The output is similar to before, although note that our `awesome` file
wasn't transferred, since it hasn't been modified since our last
snapshot. And for good measure, let's repeat that 7 more times. We now
have 10 backups, 9 of which contain 100MB files in them. Let's see how
that affects the size of the sink:

```
$ du -sh /tmp/source
96M	/tmp/source
$ du -sh /tmp/sink
96M	/tmp/sink
```

So 9 copies of 96MB only takes up 96MB of space? How is that possible?
This is the essence of the **incremental** part of emu's
behaviour. Only the *differences* in files are stored. Snapshots don't
contain duplicate data. This lends to very lightweight sinks, where
multiple snapshots can occupy very small amounts of space compared to
separate standalone snapshots. The overhead for an individual snapshot
is absolutely minuscule, so there's no reason not to create them.

###### log

Ok, so we've created our snapshots, let's find out a little bit more
about them. For this, we can use the `log` program:

```
$ emu log
snapshot       54090ae59bf5695c05aea2cb851309b7b5137007
Name:          2014-09-05 00.59.17
Parent:        540907119bf5695c05aea2cb851309b7b5137007
Checksum:      sha1sum
Date:          Friday September 05 00:59:17 2014
Size:          96M

snapshot       540907119bf5695c05aea2cb851309b7b5137007
Name:          2014-09-05 00.42.57
Parent:        540907109bf5695c05aea2cb851309b7b5137007
Checksum:      sha1sum
Date:          Friday September 05 00:42:57 2014
Size:          96M

...
```

This shows us a bunch of metadata about each snapshot. At this stage,
most of it isn't that important to us, the critical piece of
information here is the **ID** of each snapshot. We'll need that later
on. It's also worth noting that running log with the argument
`--short` can be useful for quickly comparing snapshot IDs and names.

So how do we actually explore the snapshots we have created? Easy,
simply look inside our `sink` directory:

```
$ ls /tmp/sink
2014-09-05 00.12.20
2014-09-05 00.36.25
2014-09-05 00.37.40
2014-09-05 00.42.51
2014-09-05 00.42.52
2014-09-05 00.42.53
2014-09-05 00.42.54
2014-09-05 00.42.55
2014-09-05 00.42.56
2014-09-05 00.42.57
Most Recent Backup
```

We now see 11 files, which are **symbolic links** to individual
snapshots. The `Most Recent Backup` links is special in that it points
to the current HEAD. All of the other links point to unique
snapshots. If we follow one of these symlinks, we see our files,
preserved for all eternity (or until hardware failure) at that exact
moment in time:

```
$ ls -l "/tmp/sink/2014-09-05 00.42.57/"
total 97664
-rw-rw-r-- 10 chris chris         8 Sep  5 00:12 awesome
-rw-rw-r--  9 chris chris 100000000 Sep  5 00:35 data
```

Again, emu is designed from the bottom up to be
**transparent**. People should be able to browse and manage their
backups in exactly the same way they would with normal files, using
whatever tools and programs they feel most comfortable with. The emu
program is there only to provide the necessary groundwork to enable
that, it should never get in the way.

The eagle eyed amongst us will noticed that the sink is configured to
store 10 backups. This is the default number, and can be changed by
user at any time (we'll cover customisation in a later tutorial). Now
that we have 10 snapshots in our test sink, let's push another one and
see what happens:

```
$ emu push
origin: removing snapshot 2014-09-05 00.12.20
origin: pushing snapshot (10 of 10)
sending incremental file list
created directory /tmp/sink/.emu/trees/new

sent 99 bytes  received 59 bytes  316.00 bytes/sec
total size is 100.00M  speedup is 632,911.44
origin: HEAD at 54090ae59bf5695c05aea2cb851309b7b5137007
origin: new snapshot 2014-09-05 00.59.17
```

Here we see the final new concept for today, which is right there in
the first line of output. When a sink hits its snapshot limit, it
**rotates**. That is, it removes the oldest snapshot. This is
incredibly useful when automating your backups. For example, if you
wanted to keep daily backups of the last two months of a filesystem,
you can set the maximum number of snapshots to 60, and just add a
daily cronjob to run `push`. Emu will take care of the rest.

This time I leave it as an exercise for the reader to have a poke
around the `.emu` directory if they would like to learn more about how
the emu internals work. Now that we know how to create backups, we'll
be back in Part 3 to show you how to restore your files from
snapshots!

#### [Part 3: Verify and checkout](/posts/emu-by-example-3/)
