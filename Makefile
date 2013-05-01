# Use V=1 to see full verbosity
QUIET_  = @
QUIET   = $(QUIET_$(V))

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
	index.php				\
	$(NULL)

html +=						\
	404.html				\
	$(NULL)

css +=	assets/css/styles.css

js += 						\
	assets/js/impress.js			\
	assets/js/site.js			\
	$(NULL)

extra_site +=					\
	assets/img/arrows.png			\
	assets/img/facebook.png			\
	assets/img/favicon.ico			\
	assets/img/github.png			\
	assets/img/linkedin.png			\
	assets/img/my-face.png			\
	assets/img/screenshot-facebook.png	\
	assets/img/screenshot-github.png	\
	assets/img/screenshot-linkedin.png	\
	assets/img/screenshot-youtube.png	\
	assets/img/youtube.png			\
	uni/dissertation.pdf			\
	uni/sustainability.pdf			\
	uni/voluntary-cooperation.pdf		\
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
clean_files = $(html) $(css) $(js)

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
	$(QUIET)rm -fv $(clean_files)

# See: https://developers.google.com/closure/compiler/
CLOSURE_COMPILER_JAR = ~/src/closure-compiler/build/compiler.jar

# See: http://yui.github.io/yuicompressor/
YUICOMPRESSOR_JAR = ~/src/yuicompressor/build/yuicompressor-2.4.8pre.jar

# See: https://code.google.com/p/htmlcompressor/
HTMLCOMPRESSOR_JAR = ~/src/htmlcompressor/target/htmlcompressor-1.5.3-SNAPSHOT.jar

#
# Generate site content
#
%.js: %.js.in
	@echo '  JS       $@'
	$(QUIET)chmod 644 $<
	$(QUIET)java -jar $(CLOSURE_COMPILER_JAR) --js=$< --js_output_file=$@

%.css: %.css.in
	@echo '  CSS      $@'
	$(QUIET)chmod 644 $<
	$(QUIET)java -jar $(YUICOMPRESSOR_JAR)	--charset utf-8 -v \
						--type css $< >$@

%.html: %.html.in
	@echo '  HTML     $@'
	$(QUIET)chmod 644 $<
	$(QUIET)java -jar $(HTMLCOMPRESSOR_JAR) $< >$@

%.php: %.php.in
	@echo '  PHP      $@'
	$(QUIET)chmod 644 $<
	$(QUIET)java -jar $(HTMLCOMPRESSOR_JAR) $< >$@
