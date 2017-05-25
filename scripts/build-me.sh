#!/bin/bash
#
# Start the development tools.
#
set -eux

# Spawn a jekyll server to host the website on localhost:4000.
bundle exec jekyll serve &
serve_pid=$!

# Spawn a process to watch the css/ directory and automatically compile .less
# files into compressed .css files.
watch-less -c -d css -e .css &
watch_less_pid=$!

finish() {
        # tidy up by ensuring any forked processes terminate
        set +e
        kill $serve_pid 2>/dev/null
        kill $watch_less_pid 2>/dev/null
}
trap finish EXIT

# Spawn a process to watch the top directory and rebuild the website whenever
# anything changes.
bundle exec jekyll build --watch
