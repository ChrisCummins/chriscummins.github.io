# This is the data for my blog

It is automatically transformed by [Jekyll](http://github.com/mojombo/jekyll)
into a static site whenever I push this repository to GitHub.

## Setup

Install the dependencies. On Linux:

```sh
$ sudo apt install ruby ruby-dev ffmpeg
$ sudo gem install bundler
$ bundle install
```

On macOS:

```sh
$ brew install ruby ffmpeg
$ sudo "$(brew --prefix)/opt/ruby/bin/gem" install -n "$(brew --prefix)/bin" bundler:2.1.4
$ "$(brew --prefix)/bin/bundle" install
```

## Running the site locally

```sh
# Generate site files
$ make all
# Serve locally on http://127.0.0.1:4000
$ make run
```

## Pushing to staging site

```sh
$ git remote add staging git@github.com:ChrisCummins/staging.git
$ git push staging master:gh-pages
```

Check the staging site at http://chriscummins.cc/staging

## License

The website code is
[MIT Licensed](https://github.com/ChrisCummins/chriscummins.github.io/blob/master/LICENSE),
but the website *content* is not. The following directories and their contents
are copyright Chris Cummins:
* `_posts/`
* `images/`,
* `img/`,
* `pub/`
* `u/`.

You may not reuse anything therein without my permission.
