---
layout: default
title: Building a portable $PATH
---

I regularly swap between several different Linux instances, which all share a
common shell configuration file. One of my pet nuisances is that the $PATH
variable ends up swelling in size to accommodate for all of the setup-specific
directories for binaries, leading to a bloated variable full of directories
which may not even exist on the specific machine.

I had a few minutes to burn today so I wrote a small snippet for my `.bashrc`
that allows me to maintain a list of all the desired PATH directories which are
then added on an as-needed basis, only if the directory exists on the current
system:

```
# The list of directories to add to the path. Directories
# are added sequentially from first to last. A directory
# is only added if it exists.
path_dirs=( \
            ~/bin \
            ~/.local/bin \
            ~/emacs/bin \
            ~/android-sdks/platform-tools \
            /usr/lib/ccache \
            /usr/local/bin \
            /usr/contrib/bin \
            /opt/bin \
            /bin \
            /usr/bin \
            /usr/local/games \
            /usr/games \
            )

# Build path from directory list
unset PATH
for d in "${path_dirs[@]}"; do
  test -d $d && PATH=$PATH:$d
done

# Strip the leading ':' from the path
export PATH=${PATH:1}

# Respect the environment
unset path_dirs
```

Lovely, now I have a neat and tidy PATH once again. Why didn't I fix this
before?
