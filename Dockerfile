FROM node:alpine
WORKDIR /xrb-bot
COPY package.json ./
RUN npm install
RUN npm install typescript
COPY . .
EXPOSE 3334
CMD ["npm", "start"]