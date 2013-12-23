#!/bin/bash
#
# Slightly hacky bash script to quickly start of the development tools.
#
topsrcdir=chriscummins.github.io

# Look up the top source directory. Do this by traversing up the directory tree
# from the current directory. If we haven't found the top directory by the time
# we reach root (/), fail.
get_source_directory() {
	local root=""

	while [[ "$(pwd)" != "/" ]]; do
		if [[ "${PWD##*/}" = "$topsrcdir" ]]; then
			echo "$(pwd)"
			return
		fi
		cd ..
	done

	echo "fatal: Unable to locate source directory." >&2

	# If we can't find a real path to change to, then return something bogus
	# so that cd will fail and the script will terminate.
	echo "/not/a/real/file/path"
}

set -e

cd $(get_source_directory)

# Spawn a jekyll server to host the website on localhost:4000.
bundle exec jekyll serve &

# Spawn a process to watch the css/ directory and automatically compile .less
# files into compressed .css files.
watch-less -c -d css -e .css &

# Spawn a process to watch the top directory and rebuild the website whenever
# anything changes.
bundle exec jekyll build --watch
