# FROM node:18-alpine

# WORKDIR /frontend

# RUN npm i -g vue @vue/cli @vue/cli-service

# EXPOSE 3030

# ENV NUXT_HOST=0.0.0.0
# ENV NUXT_PORT=3030

# ENTRYPOINT npm install && npm run dev

FROM node:18-alpine

WORKDIR /frontend

COPY . .

RUN npm install
RUN npm install -g next
EXPOSE 3000

ENV NEXT_HOST=0.0.0.0
ENV NEXT_PORT=3000

ENTRYPOINT npm run dev

