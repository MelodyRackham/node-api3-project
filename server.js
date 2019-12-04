const express = require('express');

const server = express();
server.use(express.json());
server.use(logger);
const router = require('./users/userRouter');
server.use('./api/users', router);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
  next();
});

//custom middleware

function logger(req, res, next) {}

module.exports = server;
