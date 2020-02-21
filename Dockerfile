FROM node:12
WORKDIR /app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build --production


FROM nginx:1.15.10-alpine
COPY ops/nginx.conf /etc/nginx/nginx.conf
COPY build /usr/share/nginx/html