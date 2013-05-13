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
	gen-regions.html			\
	genetics/index.html			\
	$(NULL)

css +=						\
	assets/css/buttons.css			\
	assets/css/genetics.css			\
	assets/css/styles.css			\
	$(NULL)

js += 						\
	assets/js/gen-regions.js		\
	assets/js/genetics.js			\
	assets/js/impress.js			\
	assets/js/site.js			\
	assets/js/webcam.js			\
	$(NULL)

extra_site +=					\
	assets/img/arrows.png			\
	assets/img/check.png			\
	assets/img/facebook.png			\
	assets/img/favicon.ico			\
	assets/img/github.png			\
	assets/img/linkedin.png			\
	assets/img/my-face.jpg			\
	assets/img/screenshot-facebook.png	\
	assets/img/screenshot-github.png	\
	assets/img/screenshot-linkedin.png	\
	assets/img/screenshot-youtube.png	\
	assets/img/youtube.png			\
	genetics/eiffel-tower.jpg		\
	genetics/kyle-broflovski.jpg		\
	genetics/mona-lisa.jpg			\
	genetics/piet-mondrian.jpg		\
	genetics/shutter.mp3			\
	genetics/sunflowers.jpg			\
	genetics/tom-waits.jpg			\
	genetics/webcam.swf			\
	uni/dissertation.pdf			\
	uni/sustainability.pdf			\
	uni/voluntary-cooperation.pdf		\
	$(shell find genetics/docs)		\
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

.PHONY: docs
docs:
	@echo '  JSDOC    Documentation/genetics'
	$(QUIET)$(JSDOC) -c Documentation/jsdocrc.json 			\
		assets/js/genetics.js.in -d Documentation/genetics
	$(QUIET)rm -rf genetics/docs
	$(QUIET)mkdir genetics/docs
	$(QUIET)cp -r Documentation/genetics/* genetics/docs

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
