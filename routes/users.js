var express = require('express');
var user = require('../models/users');
var expressValidator = require('express-validator');
var session = require('express-session');
var router = express.Router();
const bcrypt = require('bcrypt-nodejs');
router.use(expressValidator());
router.use(session({
    secret : '2C44-4D44-WppQ38S',
    resave : true,
    saveUninitialized : true
}));

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

//post for login
router.post('/login', async function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.render('login.ejs', { errors: errors});
    }
    else {
        var userExists  = await user.userExists(email);
        if (userExists){
            var passwordIsCorrect = await user.checkPassword(email, password);
            if (passwordIsCorrect){
                var userRaw = await user.findUserByEmail(email);
                var userInfo = await userRaw.rows[0];
                req.session.logged = true;
                req.session.fname = userInfo.fname;
                req.session.phone = userInfo.phone;
                req.session.address = userInfo.address;
                req.session.email = userInfo.email;
                req.session.is_admin = userInfo.is_admin;
                res.redirect('/');
            } else {
                res.render('login.ejs', {msg: "Password Incorrect"});
            }
        } else {
            res.render('login.ejs', {msg: "No such account"});
        }
    }

});

router.get("/logout", function(req, res){
    console.log(req.session);
    req.session.destroy();
    console.log(req.session);
    res.redirect('/');
});


module.exports = router;
