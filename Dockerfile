# Dockerfile para publicar projeto Node.js com Fastify e TypeScript
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

ENV PORT=8080
ENV HOST=0.0.0.0

CMD ["npm", "start"]
