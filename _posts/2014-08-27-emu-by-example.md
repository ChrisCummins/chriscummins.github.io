---
layout: default
title: Emu by example
---

This post introduces emu, a pet project which I have been developing
on a casual stop-start basis for the past two years. Emu is a fast,
incremental, rotating snapshot backup program with checksum
verification and branch support, strongly inspired by
[git](http://git-scm.com/) and Apple's
[Time Machine](http://support.apple.com/kb/HT1427).

It was born out of a desire to be able to conveniently and reliably
backup a huge amount of data to multiple locations without having to
resort to extensive and error prone bash scripting, and which didn't
bundle up data in arbitrary binary blobs. I wanted a system which was
simple, transparent, and easy to use. So I made one.

The following blog posts contain a quick and hands-on introduction to
the seven primary functions of emu, intended to get people up and
running with it quickly. The concepts are simple and the commands will
seem familiar to anyone with experience of git. Note that development
is in alpha stage and things change quickly. This blog pertains to the
current stable release, 0.1.42. Be sure to check out the project's
[GitHub page](https://github.com/ChrisCummins/emu) for the latest
updates.

#### Table of Contents

 * [Part 1: Sinks and sources](/posts/emu-by-example-1/)
 * [Part 2: Push and log](/posts/emu-by-example-2/)
 * Part 3: Verify and checkout (work in progress)
 * Part 4: Squash and prune (work in progress)
 * Part 5: Clean and customisation (work in progress)
