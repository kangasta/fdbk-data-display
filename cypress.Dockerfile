FROM cypress/base:14

COPY . /app
WORKDIR /app
RUN apt-get update && \
    apt-get install -y chromium && \
    npm ci

ENTRYPOINT ["./node_modules/.bin/cypress", "run"]
CMD ["--browser", "chromium", "--headless"]
