// Config Variables
var express = require('express');
var router = express.Router();
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
        res.render('catalog/catalog', { list, title: 'Catalog' });
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});


// ====================================== //
// == GET Requests for Creating Items === //
// ====================================== //
// Create a new item page
router.get('/createitems', function (req, res, next) {
    res.render('catalog/createitem', { title: 'Create Item' });
});
// Create a new book 
router.get('/createitems/createBook', function (req, res, next) {
    res.render('catalog/createBook', { title: 'Create Item' });
});
// Create a new magazine 
router.get('/createitems/createMagazine', function (req, res, next) {
    res.render('catalog/createMagazine', { title: 'Create Item' });
});
// Create a music 
router.get('/createitems/createMusic', function (req, res, next) {
    res.render('catalog/createMusic', { title: 'Create Item' });
});
// Create a new movie 
router.get('/createitems/createMovie', function (req, res, next) {
    res.render('catalog/createMovie', { title: 'Create Item' });
});


// ====================================== //
// == POST Requests for Creating Items === //
// ====================================== //
// Create a new book: Post request
router.post('/createitems/createbook', function (req, res) {

    const newbook = {
        "title": req.body.title,
        "author": req.body.author,
        "format": req.body.format,
        "pages": req.body.pages,
        "publisher": req.body.publisher,
        "language": req.body.language,
        "isbn10": req.body.isbn10,
        "isbn13": req.body.isbn13,
        "quantity": req.body.quantity
    };

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('format', 'Format is required').notEmpty();
    req.checkBody('pages', 'Page number is required').notEmpty();
    req.checkBody('publisher', 'Publisher is required').notEmpty();
    req.checkBody('language', 'Language is required').notEmpty();
    req.checkBody('isbn10', 'ISBN10 is required').notEmpty();
    req.checkBody('isbn13', 'ISBN13 is required').notEmpty();
    req.checkBody('quantity', 'Quantity is required').notEmpty();
    const err = req.validationErrors();
    if (err) {
        res.render('catalog/createBook', {errors: err, title: 'Create Item'});
    } else {
        console.log(newbook);
        catalog.insertNewBook(newbook);
        res.render('catalog/catalog', { title: 'Catalog' });
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
                res.render('catalog/updateBook', { results, title: 'Catalog' });
                break;
            case "Magazine":
                res.render('catalog/updateMagazine', { results, title: 'Catalog' });
                break;
            case "Movie":
                res.render('catalog/updateMovie', { results, title: 'Catalog' });
                break;
            case "Music":
                res.render('catalog/updateMusic', { results, title: 'Catalog' });
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
        //let agree = confirm ("Are you sure to delete this record");
        const client = await pool.connect();
        const resultDeleteBook = await client.query('DELETE FROM Items WHERE item_id = ($1)', [req.params.item_id]);
            console.log("Deleted Book");
        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


//Magazine
router.get('/deletemagazine/:item_id', async(req, res) => {

    try {
        const client = await pool.connect();
        const resultMagazine = await client.query('DELETE FROM Items WHERE item_id = ($1)', [req.params.item_id]);
            console.log("Deleted Magazine");
        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

//Movies
router.get('/deletemovie/:item_id', async(req, res) => {

    try {
        const client = await pool.connect();
        const resultDeleteMovie = await client.query('DELETE FROM Items WHERE item_id = ($1)', [req.params.item_id]);
            console.log("Deleted Movie");
        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

//Music
router.get('/deletemusic/:item_id', async(req, res) => {

    try {
        const client = await pool.connect();
        const resultDeleteMusic = await client.query('DELETE FROM Items WHERE item_id = ($1)', [req.params.item_id]);
            console.log("Deleted Music");
        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});




//keep the next line at the end of this script
module.exports = router;
