FROM node:12

#WORKDIR /app

#COPY . .

ENV VUE_APP_API=$VUE_APP_API

RUN env
RUN node -e 'console.log(process.env)'
#RUN npm install
#RUN npm run build

COPY ./dist ./dist
