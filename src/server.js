require('dotenv').config()
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const helmet = require("helmet");
const cors = require('cors');

// Set App Variable
const app = express()

// TEMPLATING ENGINE
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', 'src/views')

// app.use(helmet());

// COOKIE PARSER
app.use(cookieParser());

app.use(express.static('src/public'))

// USE BODY PARSER
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());

const User = require('./models/user')
const AccessToken = require('./models/accessToken')

// CHECK FOR AUTH
var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (req.headers['qr-token']) {
    console.log("Checking QR Token");
    AccessToken.findOne({'token':req.headers['qr-token']})
    .then(accessToken => {
      req.accessToken = accessToken
      next();
    })
  } else if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
    next();
  } else {
    
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload
    User.findById(decodedToken.payload._id).populate('accessTokens').lean()
    .then(u => {
      req.currentUser = u
      next();
    })
  }
};
app.use(checkAuth);


// PRINT REQUEST INFO
app.use((req, res, next) => {
    const now = new Date().toString()
    console.log(`Requested ${req.url} at ${now}`)
    next()
})

// Database Setup
require('./config/db-setup.js')

// Routes
const router = require('./routes/index.js')
app.use(router)

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`QR API listening on port ${process.env.PORT}!`)
})

module.exports = app