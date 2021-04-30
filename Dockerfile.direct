FROM node:14
COPY . /
RUN set -x \
  && npm ci \
  && npm run build --production

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=0 /build /usr/share/nginx/html
