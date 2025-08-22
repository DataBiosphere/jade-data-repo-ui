# Change the value to ensure that the code generation is rerun
ARG CACHEBUST=1
# The location - relative to inside of the docker image - of the TDR OpenApi Yaml to use
ARG TDR_OPEN_API_YAML_LOCATION=https://jade.datarepo-dev.broadinstitute.org/data-repository-openapi.yaml

## Step 1. Run code generation
FROM openapitools/openapi-generator-cli:v6.2.1 as codegen
ARG CACHEBUST
ARG TDR_OPEN_API_YAML_LOCATION
RUN /usr/local/bin/docker-entrypoint.sh generate -g typescript-axios -i $TDR_OPEN_API_YAML_LOCATION -o /local/src/generated/tdr --skip-validate-spec


## Step 2. Build the deployable UI artifacts
FROM node:20.19.4-bookworm-slim as build
# Install git to check out the code keeping image minimal, and clean up cache after installing
RUN apt-get update \
  && apt-get install -y --no-install-recommends git \
  && rm -rf /var/lib/apt/lists/*
# Check out the build
RUN set -x \
  && git clone https://github.com/DataBiosphere/jade-data-repo-ui \
  && cd jade-data-repo-ui \
  && git fetch --tags \
  && git checkout $(git describe --tags `git rev-list --tags --max-count=1`)
# Copy the generated code
COPY --from=codegen /local /jade-data-repo-ui
# Build the code
RUN cd jade-data-repo-ui \
  && export DISABLE_ESLINT_PLUGIN=true \
  && npm ci \
  && npm run build-no-code-gen

## Step 3. Copy the static UI artifacts into an nginx image to host
FROM us.gcr.io/broad-dsp-gcr-public/base/nginx:stable-alpine
COPY --from=build /jade-data-repo-ui/build /usr/share/nginx/html
