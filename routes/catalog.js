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
router.post('/createitems/createbook', async function (req, res) {

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
        res.render('catalog/catalog', {title: 'Catalog'});
    }

    try {
        const client = await pool.connect();
        const result = await client.query("INSERT INTO Items (discriminator) VALUES ('Book');INSERT INTO Books (item_id, discriminator, quantity, loand_period, loanable, title, author, format, pages, publisher, language, isbn10, isbn13)"+"SELECT select_id,'Book',"+newbook.quantity+",7,TRUE,'"+newbook.title+"','" +newbook.author+ "','" +newbook.format+ "'," +newbook.pages+ ",'" +newbook.publisher+ "','" +newbook.language+ "', " +newbook.isbn10+ ", " +newbook.isbn13+ "FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
        );

    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
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
        const result = await client.query("SELECT * FROM magazines WHERE magazine_id = ($1)", [req.params.item_id]);
        const results = { 'results': (result) ? result.rows : null};
        res.render('catalog/updateMagazine', {results, title: 'Catalog'});
        client.release();
	} catch (err) {
        console.error(err);
        res.render('error', { error: err });
	}
});

router.get('/updatemovie/:item_id', async (req, res) => {
	try {
        const client = await pool.connect()
        const result = await client.query("SELECT * FROM movies WHERE movie_id = ($1) ", [req.params.item_id]);
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
    const newItem = {
        "title": req.body.title,
        "author": req.body.author,
        "format": req.body.format,
        "pages": req.body.pages,
        "publisher": req.body.publisher,
        "language": req.body.language,
        "isbn10": req.body.isbn10,
        "isbn13": req.body.isbn13,
        "loanable": req.body.loanable,
        "loand_period": req.body.loand_period,
        "quantity": req.body.quantity
    };
    try {
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE books SET " +
            "title = '"+ newItem.title + "', " +
            "author = '" + newItem.author + "', " +
            "format = '" + newItem.format + "', " +
            "pages = " + newItem.pages + ", " +
            "language = '" + newItem.language + "', " +
            "isbn10 = " + newItem.isbn10 + ", " +
            "isbn13 = " + newItem.isbn13 + ", " +
            "loanable = '" + newItem.loanable + "', " +
            "loand_period = " + newItem.loand_period + ", " +
            "quantity = "+ newItem.quantity +
            " WHERE book_id = ($1);", [req.params.item_id]
        );
        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});


router.post('/updatemagazine/:item_id/modify', async (req, res) => {
    const newItem = {
        "title": req.body.title,
        "publisher": req.body.publisher,
        "language": req.body.language,
        "isbn10": req.body.isbn10,
        "isbn13": req.body.isbn13,
        "loanable": req.body.loanable,
        "loand_period": req.body.loand_period,
        "quantity": req.body.quantity
    };
    try {
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE magazines SET " +
            "title = '"+ newItem.title + "', " +
            "publisher = '" + newItem.publisher + "', " +
            "language = '" + newItem.language + "', " +
            "isbn10 = " + newItem.isbn10 + ", " +
            "isbn13 = " + newItem.isbn13 + ", " +
            "loanable = '" + newItem.loanable + "', " +
            "loand_period = " + newItem.loand_period + ", " +
            "quantity = "+ newItem.quantity +
            " WHERE magazine_id = ($1);", [req.params.item_id]
        );

        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

router.post('/updatemovie/:item_id/modify', async (req, res) => {
    const newItem = {
        "title": req.body.title,
        "Publisher": req.body.director,
        "producers": req.body.producers,
        "language": req.body.language,
        "dubbed": req.body.dubbed,
        "subtitles": req.body.subtitles,
        "actors": req.body.actors,
        "release_date": req.body.release_date,
        "run_time": req.body.run_time,
        "loanable": req.body.loanable,
        "loand_period": req.body.loand_period,
        "quantity": req.body.quantity
    };
    try {
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE movies SET " +
            "title = '"+ newItem.title + "', " +
            "director = '" + newItem.director + "', " +
            "producers = '" + newItem.producers + "', " +
            "language = '" + newItem.language + "', " +
            "dubbed = '" + newItem.dubbed + "', " +
            "subtitles = '" + newItem.subtitles + "', " +
            "actors = '" + newItem.actors + "', " +
            "release_date = '" + newItem.release_date + "', " +
            "run_time = " + newItem.run_time + ", " +
            "loanable = '" + newItem.loanable + "', " +
            "loand_period = " + newItem.loand_period + ", " +
            "quantity = "+ newItem.quantity +
            " WHERE movie_id = ($1);", [req.params.item_id]
        );

        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

router.post('/updatemusic/:item_id/modify', async (req, res) => {
    const newItem = {
        "title": req.body.title,
        "artist": req.body.artist,
        "label": req.body.label,
        "release_date": req.body.release_date,
        "asin": req.body.asin,
        "run_time": req.body.run_time,
        "loanable": req.body.loanable,
        "loand_period": req.body.loand_period,
        "quantity": req.body.quantity
    };
    try {
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE music SET " +
            "title = '"+ newItem.title + "', " +
            "artist = '" + newItem.artist + "', " +
            "label = '" + newItem.label + "', " +
            "release_date = '" + newItem.release_date + "', " +
            "asin = '" + newItem.asin + "', " +
            "loanable = '" + newItem.loanable + "', " +
            "loand_period = " + newItem.loand_period + ", " +
            "quantity = "+ newItem.quantity +
            " WHERE music_id = ($1);", [req.params.item_id]
        );

        res.redirect('/catalog');
        client.release();
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
