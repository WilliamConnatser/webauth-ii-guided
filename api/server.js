const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const sessionConfig = {
  name: 'monster', //defaults to sid
  secret: 'my super secret key is secret',
  cookie: {
    httpOnly: true, //True if no SSL
    maxAge: 1000 * 60 * 2, //milliseconds how long the cookie is valid for
    secure: false
  },
  resave: false, //Resave session if it didn't change
  saveUninitialized: true //create new session automatically
}

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

server.use(session(sessionConfig))
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  const username = req.session.username || 'stranger';
  res.send(`Hi ${username}`);
});

module.exports = server;
