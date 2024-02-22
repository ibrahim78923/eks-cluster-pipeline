FROM node:18-alpine
WORKDIR /frontend
COPY . .
RUN npm install 
RUN npm run build 
EXPOSE 3001
CMD ["npm", "start"]
