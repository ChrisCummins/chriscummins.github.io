# Generate lists of source files and targets
DEST = $(WWW_BUILD)/js
SRC = $(shell find . -name '*.js' -exec basename {} \;)
JS = $(addprefix $(DEST)/,$(SRC))

EXTERN_SRC = \
	bootstrap-3.0.1.min.js \
	jquery-1.10.2.min.js \
	modernizr-2.7.0.min.js \
	$(NULL)

MINIFIED = $(addprefix $(DEST)/, $(EXTERN_SRC))

noinst_SCRIPTS = $(JS)

EXTRA_DIST = $(SRC)

# Compilation command
if ENABLE_MINIFY_JS
define compile
	$(JAVA) -jar $(JS_JAR) --js=$1 --js_output_file=$2
endef
else # Disabled minification
define compile
	cat $1 > $2
endef
endif

# JavaScript compilation
$(DEST)/%.js: %.js
	@test -d $(DEST) || { \
		$(MKDIR_P) $(DEST); \
	}
if ENABLE_CONTENT_HASHING
	$(eval CHASH := $(shell $(HASH_BIN) $< | cut -c1-$(HASH_LENGTH)))
	$(eval NAME := $(addsuffix -$(CHASH).js,$(patsubst %.js,%,$@)))
else
	$(eval NAME := $@)
endif
	@test -f $(NAME) || { \
		echo '  JS     $(notdir $(NAME))'; \
		$(call compile,$<,$(NAME)); \
	}
if ENABLE_CONTENT_HASHING
	$(eval TARGET := js\/$(patsubst %.js,%,$<))
	@for h in $(HTML); do \
		sed -ri 's/(<script src=\"(\{\{ *(\w|[_.])+ *\}\})*\/?)$(TARGET)(-[0-9a-f]{$(HASH_LENGTH)})?(\.js\")/\1$(TARGET)-$(CHASH)\5/' $$h; \
	done
endif

$(MINIFIED) : $(DEST)/%.js: %.js
	@test -d $(DEST) || { \
		$(MKDIR_P) $(DEST); \
	}
if ENABLE_CONTENT_HASHING
	$(eval CHASH := $(shell $(HASH_BIN) $< | cut -c1-$(HASH_LENGTH)))
	$(eval NAME := $(addsuffix -$(CHASH).js,$(patsubst %.js,%,$@)))
else
	$(eval NAME := $@)
endif
	@test -f $(NAME) || { \
		echo '  JS     $(notdir $(NAME))'; \
		cat $< > $(NAME); \
	}
if ENABLE_CONTENT_HASHING
	$(eval TARGET := js\/$(patsubst %.js,%,$<))
	@for h in $(HTML); do \
		sed -ri 's/(<script src=\"(\{\{ *(\w|[_.])+ *\}\})*\/?)$(TARGET)(-[0-9a-f]{$(HASH_LENGTH)})?(\.js\")/\1$(TARGET)-$(CHASH)\5/' $$h; \
	done
endif
