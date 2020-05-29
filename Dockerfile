FROM nginxinc/nginx-unprivileged:stable-alpine
COPY ./ops/nginx.conf /etc/nginx/nginx.conf
COPY ./build /usr/share/nginx/html
