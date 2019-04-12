#!/bin/bash

set -e

# make sure that a project is set, similar to the api we will tag with this
: ${GOOGLE_CLOUD_PROJECT:?}

# the paths we'll use will be relative to this script
WD=$( dirname "${BASH_SOURCE[0]}" )

# build for production
npm run build --production

# buld the docker image
TAG="gcr.io/broad-jade-dev/jade-data-repo-ui:latest${GOOGLE_CLOUD_PROJECT}"
docker build -t $TAG ${WD}/..
docker push $TAG

# delete the ui pod if it exists and recreate it
kubectl apply -f "${WD}/k8s/ui-deployment.yaml"
kubectl apply -f "${WD}/k8s/ui-service.yaml"

kubectl --namespace data-repo set image deployments/ui-deployment "data-repo-ui-container=${TAG}"
