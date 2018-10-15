//to access the routes in this class, include /catalog/{ROUTE_FROM_THIS_FILE} in your URL
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

// Catalog Page
router.get('/', async (req, res) => {
    try {
        const title = 'catalog';
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
        
        res.render('catalog', {list: list, title: 'Catalog'});
        client.release();
    } catch (err) {
        console.error(err);
        res.send("partials/_error " + err);
    }

});

// Create a new item page
router.get('/createitems', function(req, res, next) {
    res.render('createitem', { title: 'Create Item'});
});
// Create a new book 
router.get('/createitems/createBook', function(req, res, next) {
    res.render('createBook', { title: 'Create Book'});
});
// Create a new magazine 
router.get('/createitems/createMagazine', function(req, res, next) {
    res.render('createMagazine', { title: 'Create Magazine'});
});
// Create a music 
router.get('/createitems/createMusic', function(req, res, next) {
    res.render('createMusic', { title: 'CreateMusic'});
});
// Create a new movie 
router.get('/createitems/createMovie', function(req, res, next) {
    res.render('createMovie', { title: 'Create Movie'});
});

// Create a new book: Post request
router.post('/createitems/createbook', function (req, res) {

    const newbook =
        {
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
        res.render('createBook', { errors: errors});
    } else {
        console.log(newbook);
        catalog.insertNewBook(newbook);
    }
    res.render('catalog', {title: 'Catalog'});
});

// update book
router.get('/update/:item_id', async (req, res) => {
	try {
        const client = await pool.connect()
        const result = await client.query("SELECT * FROM books WHERE book_id = ($1)", [req.params.item_id]);
        const results = { 'results': (result) ? result.rows : null};
        res.render('updateitem', results );
        client.release();
	} catch (err) {
        console.error(err);
        res.send("partials/_error " + err);
	}
});
//Post method for updating an item
router.post('/update/:item_id/modify', async (req, res) => {
    const newItem =
    {
        "quantity": req.body.quantity,
        "loand_period": req.body.loand_period,
        "loanable": req.body.loanable,
        "title": req.body.title,
        "author": req.body.author,
        "format": req.body.format,
        "pages": req.body.pages,
        "publisher": req.body.publisher,
        "language": req.body.language,
        "isbn10": req.body.isbn10,
        "isbn13": req.body.isbn13

    };
    try {
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE books SET quantity = " + newItem.quantity +
            ", loand_period = " + newItem.loand_period +
            ", loanable = " + newItem.loanable +
            ", title = '" + newItem.title + "'" +
            ", author = '" + newItem.author + "'" +
            ", format = '" + newItem.format  + "'" +
            ", pages = " + newItem.pages +
            ", publisher = '" + newItem.publisher + "'" +
            ", language = '" + newItem.language + "'" +
            ", isbn10 = " + newItem.isbn10 +
            ", isbn13 = " + newItem.isbn13 +
            " WHERE book_id = ($1)", [req.params.item_id]);
        res.redirect('/');
        client.release();
    } catch (err) {
        console.error(err);
        res.send("partials/_error " + err);
    }
});

//keep the next line at the end of this script
module.exports = router;
