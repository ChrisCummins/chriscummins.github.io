# Generate lists of source files and targets
SRC = $(shell find . -maxdepth 1 -name '*.php' -exec basename {} \;)
PHP = $(addprefix $(WWW_BUILD)/,$(SRC))

# We must build the HTML sources first in order to allow for content hashing ref
# updating.
SUBDIRS = \
	html \
	css \
	fonts \
	img \
	js \
	lib \
	$(NULL)

noinst_SCRIPTS = $(PHP) $(WWW_BUILD)/.htaccess

if ENABLE_AUTHENTICATION
noinst_SCRIPTS += $(WWW_BUILD)/.htpasswd
endif

EXTRA_DIST =
	$(SRC) \
	.htaccess.in \
	$(NULL)

$(WWW_BUILD)/%.php: %.php
	@test -d $(WWW_BUILD) || { \
		$(MKDIR_P) $(WWW_BUILD); \
	}
	@echo '  PHP    $(notdir $@)'
	@cat $< > $@

$(WWW_BUILD)/.htaccess: .htaccess
	@test -d $(WWW_BUILD) || { \
		$(MKDIR_P) $(WWW_BUILD); \
	}
	@echo '  APACHE $(notdir $@)'
	@cat $< > $@

$(WWW_BUILD)/.htpasswd: .htpasswd
	@test -d $(WWW_BUILD) || { \
		$(MKDIR_P) $(WWW_BUILD); \
	}
	@echo '  APACHE $(notdir $@)'
	@cat $< > $@
