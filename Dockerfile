FROM node:lts

WORKDIR /app

COPY . .

RUN npm install


EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "node", "./healthcheck.js" ]
CMD ["node", "./app.js"]


