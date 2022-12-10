FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY bin ./bin
COPY public ./public
COPY routes ./routes
COPY services ./services
COPY models ./models
COPY docs ./docs
COPY swagger.js .
COPY app.js .

EXPOSE 3000

CMD npm start