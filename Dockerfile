FROM node:latest
WORKDIR /frontend
COPY . .
Run npm install -g npm@10.4.0
RUN npm install 
RUN npm run build 
EXPOSE 3001
CMD ["npm", "start"]
