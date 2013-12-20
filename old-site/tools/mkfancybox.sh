#!/bin/bash

# mkfancybox.sh - Generate the HMTL boilerplate for a fancy box gallery.
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
class="fancybox"
gallery="gallery"

test -d fullsize || { echo 'no fullsize dir' >&2; exit 1; }
test -d thumbnails || { echo 'no thumbnails dir' >&2; exit 1; }
test ! -d img || { echo 'img dir already exists' >&2; exit 1; }
test ! -f a.out || { echo 'a.out already exists' >&2; exit 1; }

set -e

mkdir img

echo '<!-- fancybox gallery -->' > a.out

for f in `ls fullsize`; do
	test -f thumbnails/$f || { echo 'no thumbnail found for fullsize/$f' >&2; exit 1; }

	hash=`md5sum fullsize/$f | awk '{ print $1 }'`

	cp fullsize/$f img/$hash.jpg
	cp thumbnails/$f img/$hash-thumb.jpg

	echo '<a class="'$class'" rel="'$gallery'" href="'img/$hash.jpg'">' >> a.out
        echo '  <img src="'img/$hash-thumb.jpg'" alt="" />' >> a.out
        echo '</a>' >> a.out
	echo '' >> a.out

	echo $f $hash
done

echo '<!-- end of fancybox gallery -->' >> a.out
