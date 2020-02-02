# Stack Overflow Clone [![Build Status](https://travis-ci.org/josenriagu/furry-winner.svg?branch=master)](https://travis-ci.org/josenriagu/furry-winner)
Life is Beautiful. Live the moment. These things have no formula

Welcome buddy!

Remember to take a lot of water and smile a lot more all day 🤩

## To run this project locally:
- Clone this repo

    `git clone https://github.com/josenriagu/furry-winner.git soclone`

- Install dependencies

    `npm install`

- Create a .env file at the root of this project and put the variables below (if you don't specify NODE_ENV correctly, your server may not start and your database may not connect. lol)

    ```
    NODE_ENV=staging
    PORT=4000
    SECRET_KEY=placeYourDesiredSecretKeyHereWithNoSpaces
    ```

- Start Mongodb instance on your local machine on port `27017`

  - Your main database will be created as `mongodb://localhost:27017/soclone`

  - While your test database (when you run tests) will be created as `mongodb://localhost:27017/soclonetest`

- Run tests

    `npm test`

    or

- Run tests while watching files for changes (you may need to specify a different PORT since it may conflict with starting your server)

    `npm run test:watch`

- Start server with Node

    `npm start`

    or

- Start server with Nodemon (allows your server to refresh with file changes)

    `npm run server`

## Mongoose Models

### User Model

```
displayName: String, required
email: String, required
password: String, required
reputation: Number
```

### Question Model

```
question: String, required
userId: String, required
votes: Number
answers: Array
    answer: String, required
    userId: String, required
    votes: Number
tags: Array
    tag: String
notification: Boolean
```

## API Documentation

Click [here](https://documenter.getpostman.com/view/7809888/SWTD9HTJ?version=latest) to view the Postman documentation

Visit [deployed App](https://soclone.herokuapp.com)