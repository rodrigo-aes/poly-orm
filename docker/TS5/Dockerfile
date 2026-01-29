FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install --save-dev typescript@latest

COPY . .

CMD ["npm", "build"]
