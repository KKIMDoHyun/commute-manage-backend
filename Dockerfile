FROM node:16

RUN mkdir -p /app
WORKDIR /app

ADD . /app/

RUN yarn

RUN yarn build

EXPOSE 3000

ENTRYPOINT yarn start:prod