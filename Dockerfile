FROM node:12

WORKDIR /app

COPY . .

RUN export VUE_APP_API $VUE_APP_API
RUN npm install
RUN npm run build

COPY ./dist ./dist
