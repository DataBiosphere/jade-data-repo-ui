#!/bin/bash

set -e

# the paths we'll use will be relative to this script
WD=$( dirname "${BASH_SOURCE[0]}" )

# build for production
npm run build --production

# switch into minikube mode (we want the containers we build to be available locally to minikube)
eval $( minikube docker-env )

# buld the docker image
docker build -t data-repo-ui ${WD}/..

# delete the ui pod if it exists and recreate it
kubectl --namespace data-repo get pod data-repo-ui && kubectl --namespace data-repo delete pod data-repo-ui
kubectl apply -f "${WD}/ui-pod.yaml"
kubectl apply -f "${WD}/ui-service.yaml"
