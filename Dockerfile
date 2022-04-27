FROM node:14.0-buster

# Install java to run codegen
RUN apt-get update && \
    apt-get install -y software-properties-common openjdk-11-jre

RUN set -x \
  && git clone https://github.com/DataBiosphere/jade-data-repo-ui \
  && cd jade-data-repo-ui \
  && git checkout $(git describe --tags --abbrev=0) \
  && npm ci \
  && npm run build --production

# Uninstall java
RUN apt purge -y openjdk-11-jre

FROM us.gcr.io/broad-dsp-gcr-public/base/nginx:stable-alpine
COPY --from=0 /jade-data-repo-ui/build /usr/share/nginx/html
