.PHONY: all, run, help

all:
	bundle install
	bundle exec jekyll build --drafts

run:
	bundle exec jekyll serve --drafts --host=0.0.0.0

ls-unused-banners:
	@mkdir -p .build
	@ls img/banners/* | sed 's,^,/,' > .build/banners.txt
	@git grep -h 'banner:' | awk '{print $$2;}' | sort -u > .build/used-banners.txt
	@grep -F -x -v -f .build/used-banners.txt .build/banners.txt

help:
	@echo "usage: make {all,run,ls-unused-banners}"
	@echo
	@echo "   all                 build site"
	@echo "   run                 build and serve site on http://localhost:4000"
	@echo "   ls-unused-banners   list banner images which have not appeared in posts"
