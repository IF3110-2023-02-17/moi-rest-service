# Base image
FROM node:18-alpine AS dev

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules
RUN npm install

COPY . .

RUN npx prisma generate
# RUN npx prisma migrate dev

EXPOSE 8000

CMD [ "npm", "run", "serve" ]
