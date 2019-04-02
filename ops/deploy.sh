#!/bin/bash

set -e

# the paths we'll use will be relative to this script
WD=$( dirname "${BASH_SOURCE[0]}" )

# switch into minikube mode (we want the containers we build to be available locally to minikube)
eval $( minikube docker-env )

docker build -t data-repo-ui ${WD}/..

# create a data-repo namespace to put everything in
kubectl apply -f "${WD}/ui-pod.yaml"
