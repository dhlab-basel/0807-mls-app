APP_REPO := daschswiss/0807-mls-app

ifeq ($(BUILD_TAG),)
	BUILD_TAG := $(shell git describe --tag --dirty --abbrev=7)
endif
ifeq ($(BUILD_TAG),)
	BUILD_TAG := $(shell git rev-parse --verify HEAD)
endif

ifeq ($(APP_IMAGE),)
	APP_IMAGE := $(APP_REPO):$(BUILD_TAG)
endif
