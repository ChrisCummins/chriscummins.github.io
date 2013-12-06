# Generate lists of source files and targets
DEST = $(WWW_BUILD)/fonts
SRC = $(shell find . -exec basename {} \; | tail -n+2 | grep -v Makefile)
FONTS = $(addprefix $(DEST)/,$(SRC))

noinst_SCRIPTS = $(FONTS)

EXTRA_DIST = $(SRC)

# Export fonts
$(DEST)/% : %
	@test -d $(DEST) || { \
		$(MKDIR_P) $(DEST); \
	}
	@echo '  FONT   $<'
	@cp $< $@
