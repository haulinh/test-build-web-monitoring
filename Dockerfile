FROM node:10.17-alpine

WORKDIR /usr/src/app

# install package
COPY package.json .
RUN npm install

COPY . .
RUN npm run build
RUN rm -r src

EXPOSE 5555
CMD [ "npm", "run", "start" ]
