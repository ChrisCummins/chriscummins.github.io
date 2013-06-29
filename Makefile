# Use V=1 to see full verbosity
QUIET_  = @
QUIET   = $(QUIET_$(V))

# See: https://github.com/jsdoc3/jsdoc
JSDOC = ~/src/jsdoc/jsdoc

# Initialise our content variables
php :=
extra_php :=
html :=
extra_html :=
css :=
extra_css :=
js :=
extra_js :=
extra_site :=

#
# Site contents
#
#
# All html, css and js files are generated using the pattern rules defined
# below. If there are files which are not generated, then add them to a variable
# prefixed with extra_, for example, for a compressed jquery:
#
#	extra_js = assets/js/jquery.min.js
#
# Miscellaneous other assets should be added to $(extra_site).
php +=						\
	assets/ga.php				\
	genetics/webcam.php			\
	index.php				\
	message.php				\
	$(NULL)

html +=						\
	404.html				\
	boids/index.html			\
	crypto/julius.html			\
	empty.html				\
	gen-regions/index.html			\
	genetics/index.html			\
	lonely-cosmonaut/index.html		\
	music/index.html			\
	pictures/index.html			\
	site.html				\
	software/index.html			\
	style.html				\
	$(NULL)

css +=						\
	assets/css/jquery.fancybox.css		\
	assets/css/styles.css			\
	$(NULL)

js += 						\
	assets/js/boids.js			\
	assets/js/gen-regions.js		\
	assets/js/genetics.js			\
	assets/js/index.js			\
	assets/js/julius.js			\
	assets/js/lonely-cosmonaut.js		\
	assets/js/music.js			\
	assets/js/site-components.js		\
	assets/js/site.js			\
	assets/js/webcam.js			\
	$(NULL)

extra_site +=					\
	assets/js/three.min.js			\
	assets/fonts/Flat-UI-Icons.dev.svg	\
	assets/fonts/Flat-UI-Icons.eot		\
	assets/fonts/Flat-UI-Icons.svg		\
	assets/fonts/Flat-UI-Icons.ttf		\
	assets/fonts/Flat-UI-Icons.woff		\
	assets/fonts/icomoon-session.json	\
	assets/img/arrows.png			\
	assets/img/blank.gif			\
	assets/img/check.png			\
	assets/img/examples-crude.jpg		\
	assets/img/examples-line-art.jpg	\
	assets/img/facebook.png			\
	assets/img/fancybox_buttons.png		\
	assets/img/fancybox_loading.gif		\
	assets/img/fancybox_overlay.png		\
	assets/img/fancybox_sprite.png		\
	assets/img/favicon.ico			\
	assets/img/github.png			\
	assets/img/icon-boids.png		\
	assets/img/icon-gen-regions.png		\
	assets/img/icon-genetics.png		\
	assets/img/icon-julius.png		\
	assets/img/linkedin.png			\
	assets/img/screenshot-facebook.png	\
	assets/img/screenshot-github.png	\
	assets/img/screenshot-linkedin.png	\
	assets/img/screenshot-soundcloud.png	\
	assets/img/screenshot-youtube.png	\
	assets/img/slider-handle.png		\
	assets/img/slider-track.png		\
	assets/img/soundcloud.png		\
	assets/img/switch-mask.png		\
	assets/img/tile-ribbon-2x.png		\
	assets/img/tile-ribbon.png		\
	assets/img/youtube.png			\
	genetics/eiffel-tower.jpg		\
	genetics/kyle-broflovski.jpg		\
	genetics/marilyn-monroe.jpg		\
	genetics/mona-lisa.jpg			\
	genetics/piet-mondrian.jpg		\
	genetics/shutter.mp3			\
	genetics/sunflowers.jpg			\
	genetics/tom-waits.jpg			\
	genetics/webcam.swf			\
	google14e46588787ed55b.html		\
	uni/dissertation.pdf			\
	uni/sustainability.pdf			\
	uni/voluntary-cooperation.pdf		\
	$(shell find music/img)			\
	$(shell find pictures/img)		\
	$(NULL)

# site content
local_files = 					\
	$(php)  $(extra_php)			\
	$(html) $(extra_html)			\
	$(css)  $(extra_css)			\
	$(js)	$(extra_js)			\
	$(extra_site)				\
	$(NULL)

# generated files
clean_files = 					\
	$(html) $(css) $(js) 			\
	$(NULL)

#
# Create and package generated files
#
all: $(local_files)

#
# Private publishing routines
#
include Makefile.publish

publish: private_publish

#
# Remove generated files
#
.PHONY: clean
clean:
	$(QUIET)rm -rfv $(clean_files)

#
# Generate site content
#
%.js: %.js.in
	@echo '  JS       $@'
	$(QUIET)chmod 644 $<
ifndef DEBUG
	$(QUIET)java -jar libs/closure-compiler.jar --js=$< --js_output_file=$@
else
	$(QUIET)cp $< $@
endif

%.css: %.css.in
	@echo '  CSS      $@'
	$(QUIET)chmod 644 $<
ifndef DEBUG
	$(QUIET)java -jar libs/yuicompressor.jar --charset utf-8 -v \
						 --type css $< >$@
else
	$(QUIET)cp $< $@
endif

%.html: %.html.in
	@echo '  HTML     $@'
	$(QUIET)chmod 644 $<
ifndef DEBUG
	$(QUIET)java -jar libs/htmlcompressor.jar 		\
					--compress-js 		\
					--compress-css 		\
					$< >$@
else
	$(QUIET)cp $< $@
endif

%.php: %.php.in
	@echo '  PHP      $@'
	$(QUIET)chmod 644 $<
ifndef DEBUG
	$(QUIET)java -jar libs/htmlcompressor.jar $< >$@
else
	$(QUIET)cp $< $@
endif

.PHONY: check
check:
	@for f in $(js); do						\
		echo -e "\t\t**** JS: $$f ****";			\
		gjslint --strict --additional_extensions in "$$f";	\
	done;								\
	for f in $(html); do						\
		echo -e "\n\t\t**** HTML: $$f ****";			\
		tidy "$$f" 2>&1 >/dev/null | head -n-7;			\
	done;								\
	for f in $(css); do						\
		echo -e "\n\t\t**** CSS: $$f ****";			\
		csstidy "$$f" /dev/null | tail -n+6 | head -n-3 	\
			| grep -v 'Optimised' | grep -v Invalid;	\
	done
