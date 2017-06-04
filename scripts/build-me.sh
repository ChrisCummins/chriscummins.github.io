#!/bin/bash
#
# Start the development tools.
#
set -eux

# Spawn a jekyll server to host the website on localhost:4000.
bundle exec jekyll serve &
serve_pid=$!

finish() {
        # tidy up by ensuring any forked processes terminate
        set +e
        kill $serve_pid 2>/dev/null
}
trap finish EXIT

# Spawn a process to watch the top directory and rebuild the website whenever
# anything changes.
bundle exec jekyll build --watch --drafts
