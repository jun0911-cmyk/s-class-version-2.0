FROM node:14
WORKDIR /server
COPY package*.json ./
RUN ls
RUN npm install
COPY . /server
EXPOSE 8000
CMD ["npm", "start"]