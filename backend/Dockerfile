FROM node:18-alpine

WORKDIR /backend

COPY . .

RUN npm install

RUN npm i -g @nestjs/cli

EXPOSE 3000

ENTRYPOINT npm run start:dev
