CWD=$(shell pwd)
IMAGEDEV:=nudj/framework-dev
BIN:=./node_modules/.bin

.PHONY: build test tdd

build:
	@docker build \
		-t $(IMAGEDEV) \
		--build-arg NPM_TOKEN=${NPM_TOKEN} \
		.

ssh:
	-@docker rm -f framework-dev 2> /dev/null || true
	@docker run --rm -it \
		--name framework-dev \
		-e NPM_TOKEN=${NPM_TOKEN} \
		-v $(CWD)/.zshrc:/root/.zshrc \
		-v $(CWD)/src/lib:/usr/src/lib \
		-v $(CWD)/src/test:/usr/src/test \
		-v ${CWD}/src/.npmignore:/usr/src/.npmignore \
		-v $(CWD)/src/package.json:/usr/src/package.json \
		$(IMAGEDEV) \
		/bin/zsh

test:
	-@docker rm -f framework-test 2> /dev/null || true
	@docker run --rm -it \
		--name framework-test \
		-v $(CWD)/src/lib:/usr/src/lib \
		-v $(CWD)/src/test:/usr/src/test \
		$(IMAGEDEV) \
		/bin/sh -c './node_modules/.bin/standard && ./node_modules/.bin/mocha --recursive test'
