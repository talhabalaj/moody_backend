FROM node:alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
RUN rm -rf ./src

CMD [ "yarn", "start" ]