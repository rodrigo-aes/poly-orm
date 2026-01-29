FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install --save-dev typescript@4.9

COPY . .

CMD ["npm", "test"]