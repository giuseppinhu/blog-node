const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./User');

router.get('/admin/users', (req, res) => {
  User.findAll().then((users) => {
    res.render('admin/users/index', { users: users });
  });
});

router.get('/admin/user/create', (req, res) => {
  res.render('admin/users/create');
});

router.post('/user/create', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  User.findOne({ where: { email: email } }).then((user) => {
    if (user == undefined) {
      User.create({
        email: email,
        password: hash,
      })
        .then(() => {
          res.redirect('/admin/users');
        })
        .catch(() => {
          res.redirect('/admin/user/create');
        });
    } else {
      res.redirect('/admin/users');
    }
  });
});

router.get('/login', (req, res) => {
  res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    if (user != undefined) {
      var correct = bcrypt.compareSync(password, user.password);

      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  });
});

router.get('/logout', (req, res) => {
  if (req.session.user != undefined) {
    req.session.user = undefined;
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

module.exports = router;
