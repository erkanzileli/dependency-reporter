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

## Usage

Send POST request to `/subscription` endpoint with the body below

```json
{
  "email": "erkanzileli@gmail.com",
  "repository": "https://github.com/erkanzileli/graphql-backend"
}
```

Then you could have successfully registered the subscription list

[Sample mail template](https://github.com/erkanzileli/dependency-reporter/blob/master/sample.pdf) is available in root directory

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
