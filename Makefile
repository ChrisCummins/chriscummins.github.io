.PHONY: all, run, help

all:
	bundle install
	bundle exec jekyll build --drafts

run:
	bundle exec jekyll serve --drafts --host=0.0.0.0

help:
	@echo "usage: make {all,run}"
