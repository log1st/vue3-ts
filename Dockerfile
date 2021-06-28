FROM node:12 as build-stage

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
##COPY package.json ./

RUN npm install
RUN npm run build
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
##COPY . .
COPY ./dist /home/gitlab-runner/dist

#RUN npm run build-ssr
#RUN npm run serve

##EXPOSE 8080 8081
##CMD [ "node", "server.js" ]
