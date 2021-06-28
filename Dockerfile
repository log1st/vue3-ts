FROM node:12 as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

COPY --from=build /app/dist /home/gitlab-runner/dist
