## Description

It reports your public GitHub repository dependency updates daily for Node projects. Written in Nest.js

To use specify environment variables like `.env.sample` file and rename it `.env`

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# database
$ docker-compose up -d

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
