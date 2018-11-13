// Config Variables
var session = require('express-session');
var express = require('express');
var router = express.Router();
router.use(session({
    secret : '2C44-4D44-WppQ38S',
    resave : true,
    saveUninitialized : true
}));
var expressValidator = require('express-validator');
router.use(expressValidator());
var cart = require('../models/cart');
var user = require('../models/users');

// ====================================== //
// == Get shopping cart page === //
// ====================================== //
router.get('/', async (req, res) => {
    try {
      //let cart = req.session.cart;
      // console.log("SESSION: " + req.session);
      // console.log("Cart: " + req.session);
      res.render('cart', { title: 'Cart', is_logged: req.session.logged});
    } catch (err) {
      console.error(err);
      res.render('error', { error: err });
    }
});
  
router.get('/add/:item_id', async (req, res) => {
    try {
      // Add Item to cart
      //cart.addItemToCart(req);
      // console.log("ITEM_ID: " + req.params.item_id);
      res.redirect('/cart');
    } catch (err) {
      console.error(err);
      res.render('error', { error: err });
    }
});
  
router.get('/remove/:item_id', async (req, res) => {
    try {
      // Remove Item from cart
      res.redirect('/cart');
    } catch (err) {
      console.error(err);
      res.render('error', { error: err });
    }
});

//keep the next line at the end of this script
module.exports = router;