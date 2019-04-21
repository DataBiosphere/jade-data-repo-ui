#!/bin/bash

set -e

# make sure that a project is set, similar to the api we will tag with this
: ${GOOGLE_CLOUD_PROJECT:?}

# the paths we'll use will be relative to this script
WD=$(dirname "${BASH_SOURCE[0]}")
NOW=$(date +%Y-%m-%d_%H-%M-%S)

# build for production
npm run build --production

kubectl apply -f "${WD}/k8s/ui-service.yaml"
kubectl apply -f "${WD}/k8s/ui-deployment.yaml"

# buld the docker image
TAG="gcr.io/broad-jade-dev/jade-data-repo-ui:${GOOGLE_CLOUD_PROJECT}_${NOW}"
docker build -t $TAG ${WD}/..
docker push $TAG

kubectl --namespace data-repo set image deployments/ui-deployment "data-repo-ui-container=${TAG}"
