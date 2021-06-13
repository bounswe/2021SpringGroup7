FROM node:16

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

EXPOSE 80
EXPOSE 35729

RUN yarn --silent

ADD . /app

RUN yarn build

RUN set NODE_ENV="production"

CMD ["node","server.js"]