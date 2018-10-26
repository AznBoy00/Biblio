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
// DB Connection
const pool = require('../db');


// ====================================== //
// ======== Catalog Index Page ========== //
// ====================================== //
router.get('/', async (req, res) => {
    try {
        let list = await catalog.getCatalog();
        res.render('catalog/catalog', { list, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});


// ====================================== //
// == GET Requests for Creating Items === //
// ====================================== //
//
// is_logged is passed to check the session in the front-end
//

// Create a new item page
router.get('/createitems', function (req, res, next) {
    res.render('catalog/createitem', { title: 'Create Item', is_logged: req.session.logged, is_admin: req.session.is_admin});
});

router.get('/createitems/:item_id', async (req, res) => {
    try {
        let results = await catalog.getItem(req.params.item_id);
        let discriminator = await catalog.getDiscriminator(req.params.item_id);
        console.log(discriminator);
        switch (discriminator) {
            //create new book
            case "Book":
                res.render('catalog/createBook', { results, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin});
                break;
                //create new magazine
            case "Magazine":
                res.render('catalog/createMagazine', { results, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin });
                break;
             // create new movie
            case "Movie":
                res.render('catalog/createMovie', { results, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin });
                break;
             //create new music
            case "Music":
                res.render('catalog/createMusic', { results, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin });
                break;
            default:
                result = null;
                break;
        }
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});


// ====================================== //
// == POST Requests for Creating Items === //
// ====================================== //

router.post('/createitems/:item_id/create', async (req, res) => {
    try {
        let result;
        let newItem;
        newItem = await catalog.getNewItem(req.params.item_id, req);
        result = await catalog.insertNewItem(newItem, req.params.item_id);
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
        let results = await catalog.getItem(req.params.item_id);
        let discriminator = await catalog.getDiscriminator(req.params.item_id);
        console.log(discriminator);
        switch (discriminator) {
            case "Book":
                res.render('catalog/updateBook', { results, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin});
                break;
            case "Magazine":
                res.render('catalog/updateMagazine', { results, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin });
                break;
            case "Movie":
                res.render('catalog/updateMovie', { results, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin });
                break;
            case "Music":
                res.render('catalog/updateMusic', { results, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin });
                break;
            default:
                result = null;
                break;
        }
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
        let result;
        let newItem;
        // console.log("ITEM_ID: " + req.params.item_id);
        newItem = await catalog.getNewItem(req.params.item_id, req);
        // console.log(newItem);
        result = await catalog.updateItem(newItem, req.params.item_id);
        res.redirect('/catalog');
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// ====================================== //
// == GET Requests for Deleting Items === //
// ====================================== //

// Books
router.get('/deletebook/:item_id', async(req, res) => {

    try {
        //front-end will confirm if the item is to be deleted or not
        const client = await pool.connect();
        const resultDeleteBook = await client.query('DELETE FROM Items WHERE item_id = ($1)', [req.params.item_id]);
        res.redirect('/catalog'); //refresh the page with the new changes 
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


//Magazine
router.get('/deletemagazine/:item_id', async(req, res) => {

    try {
        //front-end will confirm if the item is to be deleted or not
        const client = await pool.connect();
        const resultMagazine = await client.query('DELETE FROM Items WHERE item_id = ($1)', [req.params.item_id]);
        res.redirect('/catalog');//refresh the page with the new changes 
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

//Movies
router.get('/deletemovie/:item_id', async(req, res) => {

    try {
        //front-end will confirm if the item is to be deleted or not
        const client = await pool.connect();
        const resultDeleteMovie = await client.query('DELETE FROM Items WHERE item_id = ($1)', [req.params.item_id]);
        res.redirect('/catalog');//refresh the page with the new changes 
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

//Music
router.get('/deletemusic/:item_id', async(req, res) => {

    try {
        //front-end will confirm if the item is to be deleted or not
        const client = await pool.connect();
        const resultDeleteMusic = await client.query('DELETE FROM Items WHERE item_id = ($1)', [req.params.item_id]);
        res.redirect('/catalog');//refresh the page with the new changes 
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});




//keep the next line at the end of this script
module.exports = router;
