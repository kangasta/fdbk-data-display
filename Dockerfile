FROM node:lts-alpine as build

RUN apk add git
WORKDIR /app

COPY ./package* /app/
RUN npm ci

COPY . /app
RUN export TAG=$(git name-rev --tags --name-only $(git rev-parse HEAD)) && \
    export TAG=$(test $TAG != undefined && echo $TAG || echo '') && \
    echo "TAG=$TAG" > ".env" && \
    echo "COMMIT=$(git rev-parse HEAD)" >> ".env"
RUN npm run build


FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /app
COPY ./config.js /app/config.js
