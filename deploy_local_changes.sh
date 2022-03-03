#!/usr/bin/env bash

trap swap_back EXIT

function stderr {
    >&2 echo "$@"
}

function help() {
  stderr "This little script makes it easy to switch the Dockerfile and Dockerfile.direct files "
  stderr "and deploy local UI changes to a personal deployment. "
  stderr "The script requires a 'skaffold.yml' file to be present and set up to point to a personal deployment. "
}

function setup() {
  stderr "Setting up backup files"
  cp Dockerfile Dockerfile.bak
  cp Dockerfile.direct Dockerfile.direct.bak
}

function swap_dockerfiles() {
  stderr "Swapping Dockerfile and Dockerfile.direct"
  mv Dockerfile.direct Dockerfile
}

function swap_back() {
  stderr "Restoring Dockerfiles back to their original state"
  cp Dockerfile.bak Dockerfile
  cp Dockerfile.direct.bak Dockerfile.direct
}

function skaffold_deploy() {
  stderr "Releasing local changes to personal deployment using skaffold"
  swap_dockerfiles
  skaffold run
}
while getopts "h" arg; do
  case ${arg} in
    h)
      help
      exit 0
      ;;
    *)
      stderr "Invalid option: '${arg}'"
      help
      exit 1
  esac
done

setup
skaffold_deploy