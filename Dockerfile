FROM node:lts

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .


EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "node", "./healthcheck.js" ]
CMD ["node", "./app.js"]


