FROM nginx:1.15.10-alpine
COPY ./ops/nginx.conf /etc/nginx/nginx.conf
RUN ls -al
COPY ./build /usr/share/nginx/html