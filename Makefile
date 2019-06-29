DOCKER_PRECMD := docker run --rm --name docusaurus -it -e HOME=/tmp/home -v ${PWD}:/build -u $(shell id -u):$(shell id -g) -w /build 

all: build

start:
	docker-compose down || :
	docker-compose build
	docker-compose up

shell: build-image
	$(DOCKER_PRECMD) -v ${PWD}/website:/app/website docusaurus bash

build-docker:
	bash -c "cd website && \
		yarn install && \
		yarn build && \
		rm -rf /build/build && \
		mv build/tinyCI /build/build"

build-image:
	docker build -t docusaurus .

build: build-image
	$(DOCKER_PRECMD) docusaurus make build-docker

install-github-updater:
	go install -v ./update-github-pages

gh-pages: install-github-updater
	@bash gh-pages.sh

.PHONY: all shell build-docker build-image build gh-pages
