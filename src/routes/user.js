const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const User = require('../models/user')
const AccessToken = require('../models/accessToken')
const jwt = require('jsonwebtoken');
const generateId = require("../util/generateId");



// Home Page
router.get('/', (req, res) => {
  var currentUser = req.currentUser;
  res.render('home-index', {
    currentUser: currentUser,
    pageSelect:0
  });
})

// LOGOUT
router.get('/logout', (req, res) => {
  res.clearCookie('nToken');
  res.redirect('/');
});


// Signup page
router.get("/sign-up", (req, res) => {
  var currentUser = req.currentUser;
  res.render("sign-up", {
    currentUser,
    pageSelect:1
  });
});

// Signup page
router.post("/sign-up", (req, res) => {
  // Create User and JWT
  req.body.username = req.body.username.toLowerCase();
  const user = new User(req.body);
  user.save().then((user) => {
    var token = jwt.sign({
      _id: user._id
    }, process.env.SECRET, {
      expiresIn: "60 days"
    });
    res.cookie('nToken', token, {
      maxAge: 900000,
      httpOnly: true
    });
    res.redirect('/panel');
  });
});

// LOGIN FORM
router.get('/login', (req, res) => {
  var currentUser = req.currentUser;
  res.render('login', {
    currentUser:currentUser,
    pageSelect:2
  });
});


// LOGIN
router.post("/login", (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  // Find this user name
  User.findOne({
      username
    }, "username password")
    .then(user => {
      if (!user) {
        // User not found
        return res.redirect(401, "/login")
      }
      // Check the password
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          // Password does not match
          return res.redirect(401, "/login")
        }
        // Create a token
        const token = jwt.sign({
          _id: user._id,
          username: user.username
        }, process.env.SECRET, {
          expiresIn: "60 days"
        });
        // Set a cookie and redirect to root
        res.cookie("nToken", token, {
          maxAge: 900000,
          httpOnly: true
        });
        res.redirect("/panel");
      });
    })
    .catch(err => {
      console.log(err);
    });
});

// PANEL FORM
router.get("/panel", (req, res) => {
  var currentUser = req.currentUser;
  if (currentUser == null) {
    return res.redirect(`/login`);
  }
  res.render('panel', {
    currentUser:currentUser,
    accessTokens:currentUser.accessTokens,
    pageSelect:3
  });
});

router.post("/panel", (req, res) => {
  var currentUser = req.currentUser;
  if (currentUser == null) {
    return res.redirect('/login');
  }

  var tokenCode = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 11; i++) {
    tokenCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  var newAccessToken = new AccessToken({
    label: req.body.label,
    token: tokenCode,
    user: mongoose.Types.ObjectId(req.user._id),
  })

  newAccessToken.save().then(accessToken => {
    return User.findById(req.user._id);
  }).then(user => {
    user.accessTokens.push(newAccessToken);
    user.save();
    res.redirect('/panel');
  }).catch(err => {
    console.log(err.message);
  });
});


module.exports = router