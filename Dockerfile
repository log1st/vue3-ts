FROM node:12

ARG VUE_APP_API

WORKDIR /app

COPY . .

ENV VUE_APP_API=$VUE_APP_API

RUN npm install
RUN npm run build

COPY ./dist ./dist
