FROM node:10.17-alpine

# Install yarrn
apk add yarn

WORKDIR /usr/src/app

# install package
COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN npm run build
RUN rm -r src

EXPOSE 5555
CMD [ "yarn", "run", "start" ]
