---
layout: default
title: Untangling the preprocessor
---

I found while working on my latest [pet
project](https://github.com/ChrisCummins/euclid) that GCC
[pragmas](http://gcc.gnu.org/onlinedocs/gcc/Pragmas.html) and builtins were
getting in the way of clean Doxygen parsing, for example, the following snippet
would cause problems:

```c
struct foo {
  struct bar yeah;
  char *woah;
  int wow;
} __attribute__((packed));

_Pragma("GCC diagnostic ignore -Wunused-parameter")
void foo(struct foo *f) {
  do_nothing_useful();
}
```

*(Editors note: This is not production code... yet)*

For future reference, Doxygen can easily be configured to ignore certain macros:

```ini
# ======================================
# Allow us to define our own list of
# macros to expand during preprocessing
# ======================================
ENABLE_PREPROCESSING   = YES
MACRO_EXPANSION        = YES
EXPAND_ONLY_PREDEF     = YES

# --------------------------------------
# A list of all of the macros to expand,
# in the form <macro>=<expansion>.
# --------------------------------------
PREDEFINED             = __attribute__(x)=
PREDEFINED            += _Pragma(x)=
```
