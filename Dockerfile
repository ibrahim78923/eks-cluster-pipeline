FROM node:18-alpine
WORKDIR /backend
COPY . .
RUN npm install
EXPOSE 5900
CMD [ "node", "main.js"]
