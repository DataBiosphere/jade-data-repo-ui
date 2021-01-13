FROM node:14
RUN set -x \
  && git clone https://github.com/DataBiosphere/jade-data-repo-ui \
  && cd jade-data-repo-ui \
  && git checkout $(git describe --tags --abbrev=0) \
  && npm install \
  && npm run build --production

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=0 /jade-data-repo-ui/build /usr/share/nginx/html
