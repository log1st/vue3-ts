FROM node:12

WORKDIR /app

COPY . .

RUN export VUE_APP_API=$VUE_APP_API
RUN echo $VUE_APP_API
RUN VUE_APP_API=$VUE_APP_API node -e 'console.log(process.env)'
#RUN npm install
#RUN npm run build

COPY ./dist ./dist
