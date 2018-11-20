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
var catalog = require('../models/catalog');

// ====================================== //
// == Get shopping cart page === //
// ====================================== //
router.get('/', async (req, res) => {
    if (!currentUserIsAdmin(req)){
        try {
            let list = await cart.getCartCatalog(req);
            res.render('cart', { title: 'Cart', is_logged: req.session.logged, is_admin: req.session.is_admin, list: await list, filter: false, cart: req.session.cart});
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "Admins can not loan items"}]});
    }
});

// ====================================== //
// == Add item to shopping cart === //
// ====================================== //
router.get('/add/:item_id', async (req, res) => {
  let err;
    try {
        if (!req.session.is_admin && !req.session.cart.includes(req.params.item_id)) {
        // Add Item to cart
          if(req.session.cart.length + 1 <= req.session.num_permitted_items - req.session.loaned_items.length) {
            cart.addItemToCart(req);
            console.log("---------------------------------------");
            console.log("Added item to cart with ID " + req.params.item_id);
            console.log("---------------------------------------");
          } else {
            err = "You cannot cannot loan more than " + req.session.num_permitted_items + " items.";
            res.render('error', { title: 'Error', is_logged: req.session.logged, is_admin: req.session.is_admin, error: err, cart: req.session.cart});
          }
        }
        res.redirect('back');
    } catch (err) {
      console.error(err);
      res.render('error', { error: err });
    }
});
  
// ====================================== //
// ==  Delete item from shopping cart === //
// ====================================== //
router.get('/remove/:i', async (req, res) => {
    try {
      cart.deleteItemFromCart(req);
      console.log("---------------------------------------");
      console.log("Removed item from UOW with ID " + i);
      console.log("---------------------------------------");
      res.redirect('/cart');
    } catch (err) {
      console.error(err);
      res.render('error', { error: err });
    }
});

// ====================================== //
// == Checkout entire shopping cart === //
// ====================================== //
router.get('/checkout', async (req, res) => {
  try {
    let list = await cart.getCartCatalog(req);
    let err = await cart.checkCart(req);
    if (!req.session.is_admin && err.length == 0) {
      await cart.checkoutCart(req);
      res.redirect('back');
    } else {
      console.log('CART HAS ERROR');
      res.render('cart', { title: 'Cart', err: [{msg: err}], is_logged: req.session.logged, is_admin: req.session.is_admin, list: await list, filter: false, cart: req.session.cart});
    }
  } catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

// ====================================== //
// == Clear entire shopping cart === //
// ====================================== //
router.get('/clear', async (req, res) => {
  try {
    cart.deleteAllItemsFromCart(req);
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

//keep the next line at the end of this script
module.exports = router;

let currentUserIsAdmin = function (req){
  return !!(typeof req.session.is_admin !== 'undefined' && req.session.is_admin);
};