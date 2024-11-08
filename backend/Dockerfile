FROM node:20-bullseye-slim
WORKDIR /code
COPY ./package.json .
RUN npm install
COPY . .
CMD [ "npm", "run", "deploy:prod" ]