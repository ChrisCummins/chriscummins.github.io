---
layout: default
title: Migrating PHP to Clojure
---

I have been developing a large database driven website for a
University project, which involves a user accounts system, a search
engine frontend and a data analysis backend. Having never written such
a system before, I opted to use PHP to create the first prototypes,
due in large part to the seemingly endless demand for PHP experience
in job postings, combined with the quick "pick up and go" start time
offered by Apache with `mod_php`.

Knowing full well up the front the problems and grudges that many
people have with PHP, I thought I'd document my experiences here
where, after 3 months of development, I kicked the bucket and
reimplemented the entire stack in Clojure.

##### Why PHP?

In no uncertain terms, PHP is a *broken language*. I knew this from
the outset. My first exposure to the language was in reading Eevee's
[excellent deconstruction](http://me.veekun.com/blog/2012/04/09/php-a-fractal-of-bad-design/)
of some of its many flaws, which I read long before I had even written
my first `echo "Hello world!";`.

Despite this, the undeniable truth is that PHP has been used to write
many *successful* projects, and continues to this day to be an
in-demand skill, even if the rumours of its waning popularity are to
be believed. However, for a long term solo project, the amount of
effort that was being expended working around the caveats of the
language started to drain at my enthusiasm for it, so it was time to
look a superior alternative.

##### Why Clojure?

Of the languages which I considered (including the usual suspects of
Ruby, Python & Node), Clojure stood out as being the choice that would
present the most interesting challenge to work with. Some notable
differences:

 * Purely functional programming paradigm.
 * Fresh, and fast paced development of the language.
 * A wonderful dependency management system provided by
   [leiningen](http://leiningen.org/).
 * Lower level: there's no lumbering Apache stack to get you started.
 * The possibility for simple and powerful concurrency.
 * The standard data structures are all immutable.
 * Recursion, Recursion, Recursion, Recursion...

What really appealed to me though is the elegance of LISP dialects. I
once spent a rainy weekend working through the first few chapters of
[SICP](http://mitpress.mit.edu/sicp/), and quickly found myself
engrossed in the purity of the language. While the C family of
languages feel like an extension of machine code, LISP dialects feel
like an extension of mathematics and abstract logic.

##### Porting the codebase

The rewrite took just over 3 days, and while my experiences with
Scheme meant that I was fairly comfortable with the syntax of LISPs,
it took a good few weeks afterwards to truly start to get to grip with
the paradigm and working with higher order functions. If interested,
the git tree before and after the rewrite look like: PHP
[`8ae6043a9a`](https://github.com/ChrisCummins/pip-db/tree/8ae6043a9a2a051a03c6485646396a2ed4725f04/www),
Clojure
[`cb8e4caddd`](https://github.com/ChrisCummins/pip-db/tree/cb8e4caddd5f99743fe686b00ed39389d6d1b17b/src/pip_db).
A quick comparison:

<table>
<tr><td></td><td><strong>PHP</strong></td><td><strong>Clojure</strong></td></tr>
<tr><td>Lines of code</td><td>4274</td><td>1086</td></tr>
<tr><td>Feature complete-ness</td><td>75%</td><td>80%</td></tr>
<tr><td>Test coverage</td><td>0%</td><td>5%</td></tr>
<tr><td>DOM Content Loaded</td><td>1.45 s</td><td>1.42 s</td></tr>
</table>

Advantages:

 * Massively reduced code size. LISP can be an incredibly concise
   language.
 * Support for simple unit testing built into the core language.
 * Simple plugin and library management.
 * Increased programmer happiness!

Disadvantages:

 * Unstable APIs and changing language spec.
 * Not very much documentation or examples available.
 * Almost all documentation (where found) is out of date.
