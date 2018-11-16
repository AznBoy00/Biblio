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
var catalog = require('../models/catalog');



// ====================================== //
// ======== Catalog Index Page ========== //
// ====================================== //
router.get('/', async (req, res) => {
    try {
        let list = await catalog.getCatalog();
        res.render('catalog/catalog', {filter: false, active: "", list: await list, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

router.get('/transactions', async (req, res) => {
    if (currentUserIsAdmin(req)){
        try {
            let list = await catalog.getTransactionItems();
            res.render('transactions/transactions', {filter: false, active: "", list: await list, title: 'Transactions', is_logged: req.session.logged, is_admin: req.session.is_admin});
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// ============================================== //
// ======== Get filtered catalog page ========== //
// ============================================ //

router.get('/filter/:filterType', async (req, res) => {
    try {
        let filteredList;
        //filter A to Z
        if (req.params.filterType === '1' || req.params.filterType === '2' || req.params.filterType === '3' || req.params.filterType === '4' || req.params.filterType === '5') {
            let list = await catalog.getFilteredCatalog(req.params.filterType);
            filteredList = await list;
        }
        let activeList = req.query.active;
        res.render('catalog/catalog', {filter: true, active: activeList, list: await filteredList, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// ====================================== //
// ======== View Single Item Page ======= //
// ====================================== //
router.get('/view/:discriminator/:item_id', async (req, res) => {
    try {
        let results = await catalog.getItemById(req.params.item_id, req.params.discriminator);
        let discriminator = req.params.discriminator;
        res.render('catalog/viewItem', { results, discriminator, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart});

    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// ====================================== //
// ======== View Search Items Page ======= //
// ====================================== //
router.post('/searchitems', async (req, res) => {
    try {
        let list = await catalog.getSearchResults(req.body.search);
        res.render('catalog/catalog', {filter: false, active: "", list: list, title: 'CatalogSearch', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart, cart: req.session.cart, search: req.body.search});
    } catch (err) {
        console.error("Error Has Occured during search :" + err);
        res.render('error', { error: err });
    }
});

// ====================================== //
// == GET Requests for Creating Items === //
// ====================================== //
// is_logged is passed to check the session in the front-end
// Page to select which item ti unsert. Upon selecting
// the specific item create/discriminator is rendered
router.get('/create', function (req, res) {
    if (currentUserIsAdmin(req)){
        try {
            res.render('catalog/createItems', { title: 'Create Item', is_logged: req.session.logged, is_admin: req.session.is_admin});
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// Create a new book
router.get('/create/:discriminator', function (req, res) {
    if (currentUserIsAdmin(req)){
        try {
            let discriminator = req.params.discriminator;
            res.render('catalog/createitem', { discriminator, title: 'Create Item', is_logged: req.session.logged, is_admin: req.session.is_admin});
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// ====================================== //
// == POST Requests for Creating Items === //
// ====================================== //
router.post('/create/:discriminator', async (req, res) => {
if (currentUserIsAdmin(req)){
    try {
        await catalog.insertNewItem(req, req.params.discriminator);
        // let results = await catalog.insertNewItem(req, req.params.discriminator);
        // let item_id = results.item_id.rows[0].currval;
        // let discriminator = req.params.discriminator;
        // res.redirect('/catalog/view/'+discriminator+'/'+item_id);
        res.redirect('/catalog');
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// ====================================== //
// == GET Requests for Updating Items === //
// ====================================== //
router.get('/update/:discriminator/:item_id', async (req, res) => {
    if (currentUserIsAdmin(req)){
        try {
            let results = await catalog.getItemById(req.params.item_id, req.params.discriminator);
            let discriminator = req.params.discriminator;
            res.render('catalog/updateItem', { results, discriminator, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin});
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});


// ======================================= //
// == POST Requests for Updating Items === //
// ======================================= //
router.post('/update/:discriminator/:item_id', async (req, res) => {
    if (currentUserIsAdmin(req)){
        try {
            let item_id = req.params.item_id;
            let discriminator = req.params.discriminator;
            await catalog.updateItem(req, item_id, discriminator);
            // res.redirect('/catalog');
            res.redirect('/catalog/view/'+discriminator+'/'+item_id);
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        } 
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// ====================================== //
// == GET Requests for Deleting Items === //
// ====================================== //
// DELETE an ITEM from the database
router.get('/deleteitem/:item_id', async(req, res) => {
    if (currentUserIsAdmin(req)){
        try {
            await catalog.deleteItem(req.params.item_id);
            res.redirect('/catalog'); //refresh the page with the new changes
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

//keep the next line at the end of this script
module.exports = router;

let currentUserIsAdmin = function (req){
    return !!(typeof req.session.is_admin !== 'undefined' && req.session.is_admin);
};