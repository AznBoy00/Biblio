// Config Variables
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

// manage users page
router.get('/admincp/manageusers', async (req, res) => {
    if (typeof req.session.is_admin !== 'undefined' && req.session.is_admin){
        try {
            let results = await user.displayAllUsers();
            res.render('users/manageusers', {results, title: 'Admin CP', is_logged: req.session.logged, is_admin: req.session.is_admin} );
        } catch (err) {
            console.error(err);
            res.send("error" + err);
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// promote users to admin page
router.get('/admincp/manageusers/promote/:userid', async (req, res) => {
	try {
        user.toggleAdminStatus(req.params.userid, false);
        console.log("PROMOTING: " + req.params.userid);
        res.redirect('/users/admincp/manageusers');
	} catch (err) {
        console.error(err);
        res.send("error" + err);
    }
});

// demote users to admin page
router.get('/admincp/manageusers/demote/:userid', async (req, res) => {
	try {
        user.toggleAdminStatus(req.params.userid, true);
        console.log("DEMOTING: "+ req.params.userid);
        res.redirect('/users/admincp/manageusers');
    } catch (err) {
        console.error(err);
        res.send("error " + err);
    }
});

// Users/Admin login page
router.get('/login', function(req, res, next) {
    res.render('users/login', { title: 'Login' });
});


// Registering a new user GET for request
router.get('/register', function(req, res, next) {
    res.render('users/register', { title: 'Register' });
});

// Registering a new user POST for request
router.post('/register', function (req, res) {
    const newUser ={
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
        return res.render('users/register', { errors: errors, title: "Register"});
    }
    else {
        let hash = bcrypt.hashSync(newUser.password);
        newUser.password = hash;
        console.log(hash);
        user.insertNewUser(newUser);
    }
    res.redirect('/');
});

//post for login
router.post('/login', async function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.render('users/login', { errors: errors, title: "Login"});
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
                return res.render('users/login', {errors: "Password Incorrect", title: "Login"});
            }
        } else {
            return res.render('users/login', {errors: "No such account", title: "Login"});

        }
    }
});

router.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect('/');
});

// get request for updating user profile information
router.get('/usercp', async (req, res) => {
    try {
        var email = req.session.email;
        let results = await user.getUserInfo(email);
        res.render('users/usercp', { results, title: 'User CP', is_logged: req.session.logged, is_admin: req.session.is_admin});
        } catch (err) {
          console.error(err);
          res.render('error', { error: err });
      }
  });

// post request for updating user profile information
  router.post('/usercp', async (req, res) => {
      try {
          var email = req.session.email;
          let results;
          let newUserInfo;
          // console.log("email: " + req.params.email);
          newUserInfo = await user.getNewUserInfo(email, req);
          console.log(newUserInfo);
          results = await user.updateUserInfo(newUserInfo, email);
          res.redirect('/');
      } catch (err) {
          console.error(err);
          res.render('error', { error: err });
      }
  });

module.exports = router;
