FROM node:8 as dockerize-jade-ui

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build --production
EXPOSE 3000
