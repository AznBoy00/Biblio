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
  //Checks if session is defined, else it returns the index without passing the session to avoid errors
  if (typeof req.session !== 'undefined' && typeof req.session.logged !== 'undefined') {
    is_logged = req.session.logged;
    res.render('index', { title: 'Home', is_logged: is_logged , is_admin: req.session.is_admin});
  } else {
      res.render('index', { title: 'Home' });
  }
});

// ====================================== //
// == Get shopping cart page === //
// ====================================== //
router.get('/cart', async (req, res) => {
  try {
    let cart = req.session.cart;
    
    res.render('cart', { title: 'Cart', is_logged: is_logged});
  } catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

module.exports = router;
