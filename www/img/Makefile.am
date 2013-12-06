# Generate lists of source files and targets
DEST = $(WWW_BUILD)/img
SRC = $(shell find . -name '*.png' -exec basename {} \;)
IMG = $(addprefix $(DEST)/,$(SRC))

noinst_SCRIPTS = $(IMG)

EXTRA_DIST = $(SRC)

# Export images
$(DEST)/%.png : %.png
	@test -d $(DEST) || { \
		$(MKDIR_P) $(DEST); \
	}
if ENABLE_CONTENT_HASHING
	$(eval CHASH := $(shell $(HASH_BIN) $< | cut -c1-$(HASH_LENGTH)))
	$(eval NAME := $(addsuffix -$(CHASH).png,$(patsubst %.png,%,$@)))
else
	$(eval NAME := $@)
endif
	@test -f $(NAME) || { \
		echo '  IMAGE  $(notdir $(NAME))'; \
		cp $< $(NAME); \
	}
if ENABLE_CONTENT_HASHING
	$(eval TARGET := img\/$(patsubst %.png,%,$<))
	@for h in $(HTML); do \
		sed -ri 's/(<img src=\"(\{\{ *(\w|[_.])+ *\}\})*\/?)$(TARGET)(-[0-9a-f]{$(HASH_LENGTH)})?(\.png\")/\1$(TARGET)-$(CHASH)\5/' $$h; \
	done
endif
