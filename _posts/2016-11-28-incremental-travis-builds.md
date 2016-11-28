---
layout: default
title: Incremental builds for Travis CI
---

Travis CI is one of those fantastic "how is *this* free?" tools (for other
examples, see [GitHub](https://github.com/blog/1724-10-million-repositories),
[Coursera](https://www.coursera.org/courses/?query=free%20courses), and 30+
years of *nix development). However, there is one issue which causes a major
inconvenience for me and perhaps some others on the edgiest of edge cases: there
are [hardcoded
limits](https://docs.travis-ci.com/user/customizing-the-build#Build-Timeouts) on
the maximum runtime of a job.

The idea of these timeouts is to prevent hung jobs from consuming resources
forever, but they also mean that innocent jobs which simply take a really long
time to run never complete. This can be a dealbreaker for projects containing
very large dependencies, but for those cases, we can workaround the issue using
build caches.

One of the neat features of Travis CI is the ability to
[cache](https://docs.travis-ci.com/user/caching/) arbitrary directories. The
idea is that if your project contains a large dependency, you can compile the
dependency once and then simply cache the compiled result. However, this alone
is not enough to solve the problem of building really big dependencies, since if
a job times out, it is marked as failed, and if a job fails, the caches are not
updated.

As an example, I have been working on a [big
project](https://github.com/ChrisCummins/clgen) which depends on (amongst other
things) compiling a full LLVM stack locally. Compiling LLVM takes around 2
hours, far exceeding the Travis CI timeouts. After a few frustrating days of
fiddling I managed to develop a config file which enables the build to be split
into two phases: a "cache cold" job which incrementally compiles the big
dependency, and a "cache hot" job which is for actually running the tests.

Let's say for the sake of example that your project has a big dependency
`big_dep/exe`, which is compiled from source and takes longer than the Travis CI
timeouts. To perform a two phase build, define an explicit `make big_dep/exe`
build target and put this in your Travis config:

```yml
cache:
  directories:
  - big_dep

# cache-cold build: (restart job as required)
install:
  - timeout 1800 make big_dep/exe || true
  - touch NOTEST

# cache-hot build:
# install:
#  - make all

script:
  - test -f NOTEST || ./run_tests
```

This config forces the big dependency to compile in chunks of 30 minutes, and
cache the intermediate results. Manually restart the job as many times as is
required to complete the build. Once complete uncomment the "cache-hot" rule and
comment out the "cache-cold" rule to run your tests as normal.

If your project has big dependencies and is suffering from repeated timeouts,
give this a try.
