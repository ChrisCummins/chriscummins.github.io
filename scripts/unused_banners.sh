#!/usr/bin/env bash
#
# List the banner images that are not used in a blog post.
#
# List all of the JPG files in img/banners which are not referenced by markdown
# files in this site.
set -e

main() {
  find . -type f -name '*.md' | xargs grep --only-matching --no-filename -E '/img/banners/.+' | sort --unique | sed 's,^/,,' >banners_used.txt
  find img/banners -maxdepth 1 -type f -name '*.jpg' | sort >banners.txt
  rm -rf img/banners/unused
  mkdir img/banners/unused
  comm -13 banners_used.txt banners.txt >banners_unused.txt
  for banner in $(cat banners_unused.txt); do
    echo $banner
    ln -s ../../../$banner img/banners/unused/$(basename $banner)
  done
  echo "$(wc -l banners_unused.txt | cut -d' ' -f1) unused banners symlinked to img/banners/unused"
  rm banners.txt banners_used.txt banners_unused.txt
}
main $@
