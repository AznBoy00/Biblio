// Config Variables
var express = require('express');
var user = require('../models/users');
var expressValidator = require('express-validator');
var session = require('express-session');
var router = express.Router();

var catalog = require('../models/catalog');

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
    if (currentUserIsAdmin(req)){
        try {
            let results = await user.displayAllUsers();
            res.render('users/manageusers', {results, title: 'Admin CP', is_logged: req.session.logged, is_admin: req.session.is_admin, admin_email: req.session.email} );
        } catch (err) {
            console.error(err);
            res.send("error" + err);
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});


// view active users
router.get('/admincp/viewactiveusers', async (req, res) => {
    if (typeof req.session.is_admin !== 'undefined' && req.session.is_admin){
        try {
            let results = await user.displayActiveUsers();
            console.log('Active users: ' + results.results);
            res.render('users/viewactiveusers', {results, title: 'Admin CP', is_logged: req.session.logged, is_admin: req.session.is_admin, admin_email: req.session.email, is_active: req.session.is_active} );
        } catch (err) {
            console.error(err);
            res.send("error" + err);
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin,
            is_active: req.session.is_active, errors: [{msg: "You are not an admin!"}]});
    }
});

// promote users to admin page
router.get('/admincp/manageusers/promote/:userid', async (req, res) => {
    if (currentUserIsAdmin(req)) {
        try {
            user.toggleAdminStatus(req.params.userid, false);
            console.log("---------------------------------------");
            console.log("PROMOTING user with ID " + req.params.userid);
            console.log("---------------------------------------");
            res.redirect('/users/admincp/manageusers');
        } catch (err) {
            console.error(err);
            res.send("error" + err);
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// demote users to admin page
router.get('/admincp/manageusers/demote/:userid', async (req, res) => {
    if (currentUserIsAdmin(req)){
        try {
            user.toggleAdminStatus(req.params.userid, true);
            console.log("---------------------------------------");
            console.log("DEMOTING user with ID "+ req.params.userid);
            console.log("---------------------------------------");
            res.redirect('/users/admincp/manageusers');
        } catch (err) {
            console.error(err);
            res.send("error " + err);
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
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
    req.checkBody('confirmpassword', 'Confirm password does not match the password').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.render('users/register', { errors: errors, title: "Register"});
    }
    else {
        let hash = bcrypt.hashSync(newUser.password);
        newUser.password = hash;
        // console.log(hash);
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
                catalog.flushImap(); //reset imap on login
                var userRaw = await user.findUserByEmail(email);
                var userInfo = await userRaw.rows[0];
                req.session.logged = true;
                req.session.fname = userInfo.fname;
                req.session.phone = userInfo.phone;
                req.session.address = userInfo.address;
                req.session.email = userInfo.email;
                req.session.is_admin = userInfo.is_admin;
                req.session.cart = [];
                req.session.is_active = true;
                await user.setUserStatusActive(email);
                console.log("---------------------------------------");
                console.log("LOGGING IN user "+ email);
                console.log("With session "+req.session);
                console.log("---------------------------------------");

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
    try {
        req.session.is_active = false;
        //req.session.is_active = user.toggleUserStatus(req.params.email, true);
        user.setUserStatusInactive(req.session.email);
        // console.log("LOGGING OUT: "+ req.params.email);
        req.session.destroy();
        catalog.flushImap();//reset imap on logout
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// get request for updating user profile information
router.get('/usercp', async (req, res) => {
    if (currentUserIsUser(req)){
        try {
            var email = req.session.email;
            let results = await user.getUserInfo(email);
            res.render('users/usercp', { results, title: 'User CP', is_logged: req.session.logged, is_admin: req.session.is_admin});
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not a user!"}]});
    }
  });

// post request for updating user profile information
router.post('/usercp', async (req, res) => {
    if (currentUserIsUser(req)){

        //Fetch user info.
        var email = req.session.email;
        let newUserInfo;
        let results = await user.getUserInfo(email);
        let oldPassHash = results.results[0].password;
        var oldPassMatched = false;

        //Validate current session password and user input old password to be identical.
        if(bcrypt.compareSync(req.body.oldpassword, oldPassHash)) {
            oldPassMatched = true;
        }

        //Check form fields for empty fields/match.
        req.checkBody('f_name', 'First name field is empty.').notEmpty();
        req.checkBody('l_name', 'Last name field is empty.').notEmpty();
        req.checkBody('phone', 'Phone number field is empty.').notEmpty();
        req.checkBody('oldpassword', 'Old password field is empty.').notEmpty();
        //req.checkBody('password','New password field is empty.').notEmpty();
        if(!oldPassMatched)
            req.checkBody('oldpassword', 'Current password must match to make changes.').isEmpty();
        if(req.body.password != '') {
            req.checkBody('confirmpassword', 'Confirm new password field is empty.').notEmpty();
            req.checkBody('confirmpassword', 'Confirmation password does not match.').equals(req.body.password);
        }
        const err = req.validationErrors();
        if(err){
            res.render('users/usercp', {results, errors:err, title: 'User CP', is_logged: req.session.logged});
        } else {
            try {
                //Validate new password and confirm new password to be identical, new pass is different than previous pass, and that oldpassword has been validated.
                if ((req.body.password == req.body.confirmpassword) && (req.body.password != req.body.oldpassword) && oldPassMatched) {
                    newUserInfo = await user.getNewUserInfo(email, req);
                    results = await user.updateUserInfo(newUserInfo, email);
                    //console.log("User account info UPDATE SUCCESSFUL.");
                }
                results = await user.getUserInfo(email);
                const success = ['Update Complete!'];
                res.render('users/usercp', {results, success: success, title: 'User CP', is_logged: req.session.logged});
            } catch (err) {
                console.error(err);
                res.render('error', {error: err});
            }
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not a user!"}]});
    }

});

module.exports = router;

let currentUserIsAdmin = function (req){
    return !!(typeof req.session.is_admin !== 'undefined' && req.session.is_admin);
};

let currentUserIsUser = function (req){
    return !!(typeof req.session.logged !== 'undefined' && req.session.logged);
};
