# Generate lists of source files and targets
SRC = $(shell find . -maxdepth 1 -name '*.php' -exec basename {} \;)
PHP = $(addprefix $(WWW_BUILD)/,$(SRC))

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
