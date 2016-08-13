---
layout: default
title: Fine-grained verbosity control in Makefiles
---

Do you want a quiet build, but with the ability to use CMake's
`VERBOSE=1` argument? Put these two lines at the start of your
Makefile:

```
AT_ = @
AT = $(AT_$(VERBOSE))
```

then substitute all your `@` echo suppressors with `$(AT)`. This is an
old-timey trick that gives you instant Makefile karma, firmly
establishes your UNIX creds, and is all made possible thanks to the
beauty of
[computed variable names](https://www.gnu.org/software/make/manual/html_node/Computed-Names.html#Computed-Names). If
the `VERBOSE` argument is not given, then `$(VERBOSE)` resolves to
nil, so that `$(AT)` in turn resolves to `$(AT_)`, i.e. `@`.

Recently I've taken to extending this idea in my own
[monstrosities](https://github.com/ChrisCummins/phd/blob/1e19966493f658eabd24795aa2810e3e7e729c18/Makefile)
to allow fine-grained, multi-level verbosity control. This allows me
to control the amount of crud which gets dumped to the screen over
various levels, but requires a little more boilerplate:

```
V_default := 0
V ?= $(V_default)

__verbosity_1_ = @
__verbosity_1_0 = @

__verbosity_2_ = @
__verbosity_2_0 = @
__verbosity_2_1 = @

V1 = $(__verbosity_1_$(V))
V2 = $(__verbosity_2_$(V))

.PHONY: foo
foo:
    $(V1)touch run-quietly.txt
    $(V2)touch run-really-quietly.txt
```

So now I can have my super quiet build:

```sh
$ make
```

My "tell me what's going on" build:

```
$ make V=1
touch run-quietly.txt
```

And my "tell me all the thingz" build:

```
$ make V=2
touch run-quietly.txt
touch run-really-quietly.txt
```

You can apply this idea for other stuff too, like by adding an `O=1`
argument to enable enabling different optimisation levels with their
own compiler flags.
