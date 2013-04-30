# Use V=1 to see full verbosity
QUIET_  = @
QUIET   = $(QUIET_$(V))

# Initialise our content variables
html :=
extra_html :=
css :=
extra_css :=
js :=
extra_js :=
extra_site :=

include Makefile.private

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
html +=						\
	404.html				\
	index.html				\
	$(NULL)

css +=	assets/css/styles.css

js += 						\
	assets/js/impress.js			\
	assets/js/site.js			\
	$(NULL)

extra_js += assets/js/jquery-1.9.1.min.js

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
	assets/img/screenshot-pictures.png	\
	assets/img/screenshot-soundcloud.png	\
	assets/img/screenshot-youtube.png	\
	assets/img/youtube.png			\
	$(NULL)

# site content
local_files = 					\
	$(html) $(extra_html)			\
	$(css)  $(extra_css)			\
	$(js)	$(extra_js)			\
	$(extra_site)				\
	$(NULL)

# absolute paths to server-side site content
server_files = $(patsubst %,$(SITE_PREFIX)/%,$(local_files))

# generated files
clean_files = $(html) $(css) $(js)

#
# Create and package generated files
#
all: $(local_files)

#
# Pack modified files into a tar and publish
#
TAR = .chriscummins.tar.gz

publish: $(TAR)

$(TAR): $(local_files)
	@echo '  TAR     $?'
	$(QUIET)tar -pczf $@ $?
	@echo '  SCP      $(SITE_PREFIX)/$(TAR)'
	$(QUIET)scp $(TAR) $(ADMIN)@$(ADDRESS):$(SITE_PREFIX)/ >/dev/null
	$(QUIET)ssh $(ADMIN)@$(ADDRESS) 'cd $(SITE_PREFIX)/ && \
				tar -zxf $(TAR) && \
				rm -f $(TAR) && \
				chown $(USER) $(server_files) && \
				chgrp $(USER) $(server_files)'

#
# Remove generated files
#
.PHONY: clean
clean:
	$(QUIET)rm -fv $(clean_files)

#
# See: https://developers.google.com/closure/compiler/
#
CLOSURE_COMPILER_JAR = ~/src/closure-compiler/build/compiler.jar

#
# Generate site content
#
%.js: %.js.in
	@echo '  JS       $@'
	$(QUIET)java -jar $(CLOSURE_COMPILER_JAR) --js=$< --js_output_file=$@
	$(QUIET)chmod 644 $@

%.css: %.css.in
	@echo '  CSS      $@'
	$(QUIET) cp $< $@
	$(QUIET)chmod 644 $@

%.html: %.html.in
	@echo '  HTML     $@'
	$(QUIET) cp $< $@
	$(QUIET)chmod 644 $@
