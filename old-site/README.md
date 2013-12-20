# My Narcissistic Website

This repository contains the source code for http://chriscummins.cc. There's
probably nothing of use here for a budding programmer unless you're especially
obsessed with me, or are looking for security holes to exploit. If you have any
specific questions feel free to drop me a message via the site and I can point
you in the right direction.

Any source code I've written is released under the MIT license (see
[COPYING](COPYING)). Any third-party code is distributed under the terms of
their license.

## Building the website

The website can be built in a GNU/Linux environment using the standard GNU
Autotools procedure:

```sh
$ ./autogen.sh
$ ./configure
$ make all
```

See `./configure --help` for a list of configuration options for building the
website.

### Requirements
* [Autoconf](http://www.gnu.org/software/autoconf/)
* [Automake](http://www.gnu.org/software/automake/)
* [Java](http://www.java.com/en/)
* [Node.js](http://nodejs.org/)
* [Less](http://lesscss.org/)

## Hosting the website

The website can be deployed on a LAMP stack, by exporting the contents of the
`/build/www` directory.

### Requirements
* [Apache](http://www.apache.org/)
* [MySQL](http://www.mysql.com/)
* [PHP](http://php.net/)
