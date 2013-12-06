# Generate lists of source files and targets
DEST = $(WWW_BUILD)/html
SRC = $(shell find . -maxdepth 1 -name '*.html' -exec basename {} \;)
HTML = $(addprefix $(DEST)/,$(SRC))

noinst_SCRIPTS = $(HTML)

CLEANFILES = $(shell find $(WWW_BUILD) -type f)

EXTRA_DIST = $(SRC) README.md

if ENABLE_MINIFY_HTML
define compile
	$(JAVA) -jar $(HTML_JAR) \
		--compress-js --compress-css -o $2 $1
endef
else # Disabled minification
define compile
	cat $1 > $2
endef
endif

$(DEST)/%.html: %.html
	@test -d $(DEST) || { \
		$(MKDIR_P) $(DEST); \
	}
	@echo '  HTML   $(notdir $@)'
	@$(call compile,$<,$@)
