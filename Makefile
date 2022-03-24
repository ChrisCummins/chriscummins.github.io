.PHONY: all

all: js/site.min.js img
	bundle exec jekyll build --drafts

js/site.min.js: js/site.js
	uglifyjs $< > $@

.PHONY: img

img:
	for img in $$(ls img/art/*.jpg | grep -v small.jpg); do \
		ffmpeg -y -i $$img -vf scale=1080:-1 $$(echo $$img | sed 's/\.jpg//')-small.jpg 2>/dev/null; \
	done

.PHONY: run

run:
	bundle exec jekyll serve --drafts --future --host=0.0.0.0

# Dependencies.

.PHONY: install, install-ffmpeg, install-deps

install: install-ffmpeg
	bundle install
	npm install uglify-js -g

ifeq ($(shell uname),Darwin)
install-ffmpeg:
	brew install ffmpeg
else
install-ffmpeg:
	sudo add-apt-repository ppa:mc3man/trusty-media
	sudo apt-get update
	sudo apt-get install ffmpeg
endif

.PHONY: ls-unused-banners

ls-unused-banners:
	@mkdir -p .build
	@ls img/banners/* | sed 's,^,/,' > .build/banners.txt
	@git grep -h 'banner:' | awk '{print $$2;}' | sort -u > .build/used-banners.txt
	@grep -F -x -v -f .build/used-banners.txt .build/banners.txt

.PHONY: help

help:
	@echo "usage: make {all,install,run,ls-unused-banners}"
	@echo
	@echo "   all                 build site"
	@echo "   install             install build dependencies"
	@echo "   run                 build and serve site on http://localhost:4000"
	@echo "   ls-unused-banners   list banner images which have not appeared in posts"
