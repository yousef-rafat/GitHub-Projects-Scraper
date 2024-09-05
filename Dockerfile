FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT = 2000

EXPOSE 2000

CMD [ "node", "src/index.js" ]