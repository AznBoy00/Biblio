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
    try {
        let list = await catalog.getTransactionItems();
        res.render('transactions/transactions', {filter: false, active: "", list: await list, title: 'Transactions', is_logged: req.session.logged, is_admin: req.session.is_admin});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// ============================================== //
// ======== Get filtered catalog page ========== //
// ============================================ //

router.get('/filter/:filterType', async (req, res) => {
    try {
        let filteredList;
        //filter A to Z
        if (req.params.filterType === '1' || req.params.filterType === '2' ) {
            let list = await catalog.getCatalogAlphaOrder(req.params.filterType);
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
        let discriminator = results.results[0].discriminator;
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
        res.render('catalog/catalog', {filter: false, active: "", list: list, title: 'CatalogSearch', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart, cart: req.session.cart});
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
    res.render('catalog/createItems', { title: 'Create Item', is_logged: req.session.logged, is_admin: req.session.is_admin});
});
// Create a new book
router.get('/create/:discriminator', function (req, res) {
    let discriminator = req.params.discriminator;
    res.render('catalog/createitem', { discriminator, title: 'Create Item', is_logged: req.session.logged, is_admin: req.session.is_admin});
});

// ====================================== //
// == POST Requests for Creating Items === //
// ====================================== //
router.post('/create/:discriminator', async (req, res) => {
    try {
        let results = await catalog.insertNewItem(req, req.params.discriminator);
        let item_id = results.item_id.rows[0].currval;
        let discriminator = req.params.discriminator;
        res.redirect('/catalog/view/'+discriminator+'/'+item_id);
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});
// localhost:3000/catalog/createitems

// ====================================== //
// == GET Requests for Updating Items === //
// ====================================== //
router.get('/update/:discriminator/:item_id', async (req, res) => {
    try {
        let results = await catalog.getItemById(req.params.item_id, req.params.discriminator);
        let discriminator = results.results[0].discriminator;
        res.render('catalog/updateItem', { results, discriminator, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});


// ======================================= //
// == POST Requests for Updating Items === //
// ======================================= //
router.post('/update/:discriminator/:item_id', async (req, res) => {
    try {
        await catalog.updateItem(req, req.params.item_id, req.params.discriminator);
        res.redirect('/catalog//view/'+req.params.discriminator+'/'+req.params.item_id);
        // res.redirect('/catalog');
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// ====================================== //
// == GET Requests for Deleting Items === //
// ====================================== //
// DELETE an ITEM from the database
router.get('/deleteitem/:item_id', async(req, res) => {
    try {
        await catalog.deleteItem(req.params.item_id);
        res.redirect('/catalog'); //refresh the page with the new changes 
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

//keep the next line at the end of this script
module.exports = router;
