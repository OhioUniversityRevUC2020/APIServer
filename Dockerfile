FROM node:12-alpine as build
COPY / /app/
WORKDIR /app
RUN npm install && npm run build
RUN rm -rf node_modules

FROM node:12-alpine
COPY  --from=build /app /app
WORKDIR /app
RUN npm install --production
CMD [ "npm", "run", "start" ]