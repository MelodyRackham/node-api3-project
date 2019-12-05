const express = require('express');
const server = express();
const UserRouter = require('./users/userRouter');

//custom middleware

function logger(req, res, next) {
  console.log(` ${req.method} ${req.url} ${new Date().toISOString()}`);
  next();
}
server.use(logger);
server.use(express.json());

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/api/users', UserRouter);

// module.exports = logger;

module.exports = server;
