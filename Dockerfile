FROM node:12-slim

RUN useradd app \
  && mkdir /home/app \
  && chown app:app /home/app

USER app
WORKDIR /home/app

COPY ./package.json /home/app/package.json
RUN npm install

CMD ["npm", "start"]