FROM node:12 as build-stage

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

COPY ./dist ./dist
