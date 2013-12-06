# Less CSS source files@
LESS = $(NULL)

# Generate lists of source files and targets
DEST = $(WWW_BUILD)/css
SRC = $(shell find . -name '*.css' -exec basename {} \;)
CSS = $(addprefix $(DEST)/,$(SRC))

EXTRA_DIST = $(SRC) $(shell find . -name '*.less' -exec basename {} \;)

SRC += $(LESS:.less=.css) # Generated CSS

noinst_SCRIPTS = $(CSS) $(LESS:.less=.css)

CLEANFILES = $(LESS:.less=.css)

# Less CSS compilation
%.css: %.less $(wildcard *.less)
	@echo '  LESS   $@'
	@lessc $< $@

# Compilation command
if ENABLE_MINIFY_CSS
define compile
	$(JAVA) -jar $(CSS_JAR) --charset utf-8 -v --type css $1 > $2
endef
else # Disabled minification
define compile
	cat $1 > $2
endef
endif

# CSS compilation
$(DEST)/%.css: %.css
	@test -d $(DEST) || { \
		$(MKDIR_P) $(DEST); \
	}
if ENABLE_CONTENT_HASHING
	$(eval CHASH := $(shell $(HASH_BIN) $< | cut -c1-$(HASH_LENGTH)))
	$(eval NAME := $(addsuffix -$(CHASH).css,$(patsubst %.css,%,$@)))
else
	$(eval NAME := $@)
endif
	@test -f $(NAME) || { \
		echo '  CSS    $(notdir $(NAME))'; \
		$(call compile,$<,$(NAME)); \
	}
if ENABLE_CONTENT_HASHING
	$(eval TARGET := css\/$(patsubst %.css,%,$<))
	@for h in $(HTML); do \
		sed -ri 's/(href=\"(\{\{ *(\w|[_.])+ *\}\})*\/?)$(TARGET)(-[0-9a-f]{$(HASH_LENGTH)})?(\.css\")/\1$(TARGET)-$(CHASH)\5/' $$h; \
	done
endif
