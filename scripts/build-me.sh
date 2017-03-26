#!/bin/bash
#
# Start the development tools.
#
set -e

# Spawn a jekyll server to host the website on localhost:4000.
bundle exec jekyll serve &

# Spawn a process to watch the css/ directory and automatically compile .less
# files into compressed .css files.
watch-less -c -d css -e .css &

# Spawn a process to watch the top directory and rebuild the website whenever
# anything changes.
bundle exec jekyll build --watch
