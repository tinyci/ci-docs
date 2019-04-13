DOCKER_PRECMD := docker run --rm --name docusaurus -it -e HOME=/tmp/home -v ${PWD}:/build -u $(shell id -u):$(shell id -g) -w /build docusaurus

all: build

start:
	docker-compose down || :
	docker-compose build
	docker-compose up

shell: build-image
	$(DOCKER_PRECMD) bash

build-docker:
	bash -c "cd website && \
		yarn install && \
		yarn build && \
		rm -rf /build/build && \
		mv build/tinyCI /build/build"

build-image:
	docker build -t docusaurus .

build: build-image
	$(DOCKER_PRECMD) make build-docker

install-github-updater:
	go install -v ./update-github-pages

gh-pages: install-github-updater
	git checkout master
	make build
	git branch -D gh-pages || :
	git checkout --orphan gh-pages
	find . ! -wholename './build/*' -a ! -wholename './build' -a ! -wholename './.git' -a ! -wholename './.git/*' | xargs rm -rf || :
	rsync -av build/* .
	rm -rf build
	git add .
	git commit -a -s -m "tinyCI docs generated on $$(date)"
	git push -f origin gh-pages
	update-github-pages

.PHONY: all shell build-docker build-image build
