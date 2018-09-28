var express = require('express');
var user = require('../models/users');
var expressValidator = require('express-validator');
var router = express.Router();
const bcrypt = require('bcrypt');
router.use(expressValidator());

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//Post for Sign Up
router.post('/signup', function (req, res) {

    const newUser =
        {
            "fname": req.body.first_name,
            "lname": req.body.last_name,
            "phone": req.body.mobile_number,
            "address": req.body.address,
            "email": req.body.email,
            "password": req.body.password
        };

    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('last_name', 'Last Name is required').notEmpty();
    req.checkBody('mobile_number', 'Mobile Number is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.render('signup.ejs', { errors: errors});
    }
    else {
        let hash = bcrypt.hashSync(newUser.password, 10);
        newUser.password = hash;
        console.log(hash);
        user.insertNewUser(newUser);
    }
    res.render('index', { title: 'Home' });
});

module.exports = router;