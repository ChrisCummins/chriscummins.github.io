#!/bin/bash

# mkwookmark.sh - Generate the HMTL boilerplate for a Wookmark gallery.
#
# Usage: populate the gallery/fullsize and gallery/thumbnails directories with
# identically named images, eg:
#
#   gallery/
#   gallery/fullsize/01.jpg
#   gallery/fullsize/02.jpg
#   gallery/thumbnails/01.jpg
#   gallery/thumbnails/02.jpg
#
# Then run this script. The md5 hash of the fullsize images will be used to
# determine the image name, and the html boilerplate will be generated in a.out.

# Configurables
id="tiles"
class="fancybox"
gallery="gallery"

test -d fullsize || { echo 'no fullsize dir' >&2; exit 1; }
test -d thumbnails || { echo 'no thumbnails dir' >&2; exit 1; }
test ! -d img || { echo 'img dir already exists' >&2; exit 1; }
test ! -f a.out || { echo 'a.out already exists' >&2; exit 1; }

set -e

mkdir $gallery

echo '<ul id="'$id'">' >> a.out

for f in `ls fullsize`; do
	test -f thumbnails/$f || { echo 'no thumbnail found for fullsize/$f' >&2; exit 1; }

	hash=`md5sum fullsize/$f | awk '{ print $1 }'`

	cp fullsize/$f $gallery/$hash.jpg
	cp thumbnails/$f $gallery/$hash-thumb.jpg

	echo '  <li>' >> a.out
	echo '    <a class="'$class'" rel="'$gallery'"' >> a.out
	echo '       href="'$gallery/$hash.jpg'">' >> a.out
        echo '      <img src="'$gallery/$hash-thumb.jpg'" alt="" />' >> a.out
        echo '  </a>' >> a.out
	echo '</li>' >> a.out

	echo $f $hash
done

echo '</ul> <!-- /#'$id' -->' >> a.out
