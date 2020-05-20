FROM node:12 as build

WORKDIR /usr/src/translations-nodejs

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:12

WORKDIR /var/app/

COPY --from=build /usr/src/translations-nodejs/node_modules ./node_modules

COPY --from=build /usr/src/translations-nodejs/dist/bundle.js ./

EXPOSE 8080

CMD ["node", "bundle.js"]

