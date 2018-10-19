// Config Variables
var session = require('express-session');
var express = require('express');
var router = express.Router();
router.use(session({
    secret : '2C44-4D44-WppQ38S',
    resave : true,
    saveUninitialized : true
}));

// GET homepage
router.get('/', function(req, res, next) {
  var is_logged = false;
  if (typeof req.session !== 'undefined' && typeof req.session.logged !== 'undefined') {
    is_logged = req.session.logged;
    res.render('index', { title: 'Home', is_logged: is_logged });
  } else {
      res.render('index', { title: 'Home' });
  }
});

module.exports = router;
