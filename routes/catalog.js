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
        let list = await catalog.getFullCatalog();
        // console.log(list.books[0].book_id);
        // console.log(list[0][0]);
        res.render('catalog/catalog', { list, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// ====================================== //
// ======== View Single Item Page ======= //
// ====================================== //
router.get('/viewItem/:item_id', async (req, res) => {
    try {
        let results = await catalog.getItemById(req.params.item_id);
        let discriminator = await catalog.getDiscriminator(req.params.item_id);
        res.render('catalog/viewItem', { results, discriminator, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// ====================================== //
// == GET Requests for Creating Items === //
// ====================================== //
// is_logged is passed to check the session in the front-end
// Page to select which item ti unsert. Upon selecting
// the specific item create/discriminator is rendered
router.get('/createitems', function (req, res, next) {
    res.render('catalog/createitem', { title: 'Create Item', is_logged: req.session.logged, is_admin: req.session.is_admin});
});
// Create a new book
router.get('/createitems/:discriminator', function (req, res, next) {
    res.render('catalog/create'+req.params.discriminator, { title: 'Create Item', is_logged: req.session.logged, is_admin: req.session.is_admin});
});


// ====================================== //
// == POST Requests for Creating Items === //
// ====================================== //
router.post('/createitems/create/:discriminator', async (req, res) => {
    try {
        let newItem = await catalog.getItemFromForm(req);
        await catalog.insertNewItem(newItem, req.params.discriminator);
        res.redirect('/catalog');
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});


// ====================================== //
// == GET Requests for Updating Items === //
// ====================================== //
router.get('/updateitem/:item_id', async (req, res) => {
    try {
        let results = await catalog.getItemById(req.params.item_id);
        let discriminator = await catalog.getDiscriminator(req.params.item_id);
        res.render('catalog/update'+discriminator, { results, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});


// ====================================== //
// == POST Requests for Updating Items === //
// ====================================== //
router.post('/updateitem/:item_id/modify', async (req, res) => {
    try {
        let newItem = await catalog.getItemFromForm(req);
        await catalog.updateItem(newItem, req.params.item_id);
        res.redirect('/catalog');
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
