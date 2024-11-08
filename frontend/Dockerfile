FROM node:20-bullseye-slim
WORKDIR /code
COPY ./package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "deploy"]