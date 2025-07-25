FROM node:20
WORKDIR /var/www
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm", "run", "start:prod"]
