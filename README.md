<h1 align="center">
    Worklopedia
</h1>

<hr>

## Get started

For the first launch need to create database "worklopedia". 
Create .env file like .env.example and fill it. Next step Installation

## Installation

```bash
# install all of deps
$ npm install

# !!Before app started
# load migrations in the database
$ npm run migration:start
```

## Running the app

```bash
# development
$ npm run start

# dev mode with watcher
$ npm run dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
<hr>

## Database/Typeorm

All commands for database manipulation.

```bash
# create empty migration
$ npm run migration:create PATH/MIGR_NAME

# generate migration following last changes 
$ npm run migration:generate PATH/MIGR_NAME

# run migration
$ npm run migration:start

# revert last migration
$ npm run migration:revert

# drop database
$ npm run schema:drop
```


## Documentation Swagger/Postman

In project we use Swagger and Postman for simple testing tasks.
For open documentation, open this link in your browser (localy)
### http://localhost:4000/api
Remember need to select port which you set in your environment.

Or click in the <a href="http://localhost:4000/api">Link</a>
