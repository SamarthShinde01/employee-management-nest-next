FROM node:20-alpine

WORKDIR /usr/src/app

COPY package* .

RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 5001

CMD ["node", "dist/main.js"]
