DEST = $(WWW_BUILD)/lib
SRC = $(shell find . -maxdepth 1 -name '*.html' -exec basename {} \;) \
	$(shell find . -maxdepth 1 -name '*.php' -exec basename {} \;)
LIB = $(addprefix $(DEST)/,$(SRC))
export LIB

SUBDIRS = Twig

noinst_SCRIPTS = $(LIB)

EXTRA_DIST = $(SRC)

$(DEST)/%.php: %.php
	@test -d $(DEST) || { \
		$(MKDIR_P) $(DEST); \
	}
	@echo '  PHP    $(notdir $@)'
	@cat $< > $@
