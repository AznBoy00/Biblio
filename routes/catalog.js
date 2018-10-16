// Config Variables
var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
router.use(expressValidator());
var catalog = require('../models/catalog');
// DB connection
var connString = 'postgres://hizxyalrympljm:3f4cd73544ce42e3aade5131e9d72f3d4032b8e69ac8fc37d8b8186cf3de4a3d@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d6a0flgsl8bp0c' || process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({
  	connectionString: connString,
  	ssl: true
});


// ====================================== //
// ======== Catalog Index Page ========== //
// ====================================== //
router.get('/', async (req, res) => {
    try {
        const client = await pool.connect();

        let list = [];
        const resultBook = await client.query('SELECT * FROM books');
        const resultMagazine = await client.query('SELECT * FROM magazines ');
        const resultMovie = await client.query('SELECT * FROM movies ');
        const resultMusic = await client.query('SELECT * FROM music ');
        
        
        list.resultBooks = { 'resultBooks': (resultBook) ? resultBook.rows : null};
        list.resultMagazines = { 'resultMagazines': (resultMagazine) ? resultMagazine.rows : null};
        list.resultMovies = { 'resultMovies': (resultMovie) ? resultMovie.rows : null};
        list.resultMusics = { 'resultMusics': (resultMusic) ? resultMusic.rows : null};
        
        res.render('catalog/catalog', {list, title: 'Catalog'});
        client.release();
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});


// ====================================== //
// == GET Requests for Creating Items === //
// ====================================== //
// Create a new item page
router.get('/createitems', function(req, res, next) {
    res.render('catalog/createitem', { title: 'Create Item'});
});
// Create a new book 
router.get('/createitems/createBook', function(req, res, next) {
    res.render('catalog/createBook', { title: 'Create Item'});
});
// Create a new magazine 
router.get('/createitems/createMagazine', function(req, res, next) {
    res.render('catalog/createMagazine', { title: 'Create Item'});
});
// Create a music 
router.get('/createitems/createMusic', function(req, res, next) {
    res.render('catalog/createMusic', { title: 'Create Item'});
});
// Create a new movie 
router.get('/createitems/createMovie', function(req, res, next) {
    res.render('catalog/createMovie', { title: 'Create Item'});
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

    var errors = req.validationErrors();
    if (errors) {
        res.render('catalog/createBook', { errors: errors});
    } else {
        console.log(newbook);
        catalog.insertNewBook(newbook);
        res.render('catalog/catalog', {title: 'Catalog'});
    }
});


// ====================================== //
// == GET Requests for Updating Items === //
// ====================================== //
router.get('/updatebook/:item_id', async (req, res) => {
	try {
        const client = await pool.connect()
        const result = await client.query("SELECT * FROM books WHERE book_id = ($1)", [req.params.item_id]);
        const results = { 'results': (result) ? result.rows : null};
        res.render('catalog/updateBook', {results, title: 'Catalog'});
        client.release();
	} catch (err) {
        console.error(err);
        res.render('error', { error: err });
	}
});

router.get('/updatemagazine/:item_id', async (req, res) => {
	try {
        const client = await pool.connect()
        const result = await client.query("SELECT * FROM magazine WHERE magazine_id = ($1)", [req.params.item_id]);
        const results = { 'results': (result) ? result.rows : null};
        res.render('catalog/updateMgazine', {results, title: 'Catalog'});
        client.release();
	} catch (err) {
        console.error(err);
        res.render('error', { error: err });
	}
});

router.get('/updatemovie/:item_id', async (req, res) => {
	try {
        const client = await pool.connect()
        const result = await client.query("SELECT * FROM movie WHERE movie_id = ($1)", [req.params.item_id]);
        const results = { 'results': (result) ? result.rows : null};
        res.render('catalog/updateMovie', {results, title: 'Catalog'});
        client.release();
	} catch (err) {
        console.error(err);
        res.render('error', { error: err });
	}
});

router.get('/updatemusic/:item_id', async (req, res) => {
	try {
        const client = await pool.connect()
        const result = await client.query("SELECT * FROM music WHERE music_id = ($1)", [req.params.item_id]);
        const results = { 'results': (result) ? result.rows : null};
        res.render('catalog/updateMusic', {results, title: 'Catalog'});
        client.release();
	} catch (err) {
        console.error(err);
        res.render('error', { error: err });
	}
});


// ====================================== //
// == POST Requests for Updating Items === //
// ====================================== //
router.post('/updatebook/:item_id/modify', async (req, res) => {
    const newItem =
    {
        "title": req.body.title,
        "author": req.body.author,
        "format": req.body.format,
        "pages": req.body.pages,
        "publisher": req.body.publisher,
        "language": req.body.language,
        "isbn10": req.body.isbn10,
        "isbn13": req.body.isbn13,
        "loand_period": req.body.loand_period,
        "loanable": req.body.loanable,
        "quantity": req.body.quantity
    };
    try {
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE books SET quantity = " + newItem.quantity +
            ", title = '" + newItem.title + "'" +
            ", author = '" + newItem.author + "'" +
            ", format = '" + newItem.format  + "'" +
            ", pages = " + newItem.pages +
            ", publisher = '" + newItem.publisher + "'" +
            ", language = '" + newItem.language + "'" +
            ", isbn10 = " + newItem.isbn10 +
            ", isbn13 = " + newItem.isbn13 +
            ", loanable = " + newItem.loanable +
            ", loand_period = " + newItem.loand_period +
            ", quantity = " + newItem.quantity +
            " WHERE book_id = ($1)", [req.params.item_id]);
        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});


router.post('/updatemagazine/:item_id/modify', async (req, res) => {
    try {
        const client = await pool.connect();

        // ========= TO DO ========= //
        
        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

router.post('/updatemovie/:item_id/modify', async (req, res) => {
    try {
        const client = await pool.connect();

        // ========= TO DO ========= //
        
        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

router.post('/updatemusic/:item_id/modify', async (req, res) => {
    try {
        const client = await pool.connect();

        // ========= TO DO ========= //
        
        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

//keep the next line at the end of this script
module.exports = router;
