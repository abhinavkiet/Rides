FROM node:20-alpine

ARG NODE_ENV=prod
ARG PORT=8080

ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT

WORKDIR /usr/src/app

COPY package*.json ./

RUN if [ "$NODE_ENV" = "dev" ]; then \
    npm install; \
    else \
    npm install --omit=dev; \
    fi

COPY ./ ./

EXPOSE $PORT

CMD npm run $NODE_ENV --loglevel=verbose