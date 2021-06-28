FROM node:12

#WORKDIR /app

#COPY . .

RUN env
RUN node -e 'console.log(process.env)'
#RUN npm install
#RUN npm run build

COPY ./dist ./dist
