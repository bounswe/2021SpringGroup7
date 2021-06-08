FROM node:16

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

ADD . /app

EXPOSE 80
EXPOSE 35729

RUN yarn --silent

RUN yarn build

CMD ["yarn", "start"]
