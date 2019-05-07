const router = require('express').Router();
const bcrypt = require('bcryptjs');
const restricted = require('./restricted-middleware');
const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let {
    username,
    password
  } = req.body;

  Users.findBy({
      username
    })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        //Set username in session
        req.session.username = user.username;
        //The cookie is set by express-session library when the response is send
        res.status(200).json({
          message: `Welcome ${user.username}! You got cookie`,
        });
      } else {
        res.status(401).json({
          message: 'Invalid Credentials'
        });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//Route protected by cookie
router.get('/logout', restricted, (req, res) => {
  if (req.session) {
    //Destroy session- function provided by express-session
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out')
      } else {
        res.send('buh bye')
      }
    });
  }
});

module.exports = router;