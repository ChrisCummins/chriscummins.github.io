IMG_REGEXP = \.(bmp|gif|jpg|png)$

# Generate lists of source files and targets
DEST = $(WWW_BUILD)/img
SRC = $(shell ls | grep -E '$(IMG_REGEXP)')
IMG = $(addprefix $(DEST)/,$(SRC))

noinst_SCRIPTS = $(IMG)

EXTRA_DIST = $(SRC)

# Export images
$(DEST)/%: %
	@test -d $(DEST) || { \
		$(MKDIR_P) $(DEST); \
	}
if ENABLE_CONTENT_HASHING
	$(eval CHASH := $(shell $(HASH_BIN) $< | cut -c1-$(HASH_LENGTH)))
	$(eval EXT := $(shell echo $< | awk -F . '{ print $$NF }'))
	$(eval NAME := $(addsuffix -$(CHASH).$(EXT),$(patsubst %.$(EXT),%,$@)))
else
	$(eval NAME := $@)
endif
	@test -f $(NAME) || { \
		echo '  IMAGE  $(notdir $(NAME))'; \
		cp $< $(NAME); \
	}
if ENABLE_CONTENT_HASHING
	$(eval TARGET := img\/$(patsubst %.$(EXT),%,$<))
	@for h in $(HTML); do \
		sed -ri 's/(<img src=\"(\{\{ *(\w|[_.])+ *\}\})*\/?)$(TARGET)(-[0-9a-f]{$(HASH_LENGTH)})?($(IMG_REGEXP)\")/\1$(TARGET)-$(CHASH)\5/' $$h; \
	done
endif
