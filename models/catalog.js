// DB connection
var connString = process.env.DATABASE_URL || 'postgres://hizxyalrympljm:3f4cd73544ce42e3aade5131e9d72f3d4032b8e69ac8fc37d8b8186cf3de4a3d@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d6a0flgsl8bp0c';
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: connString,
    ssl: true
});

//var item = require('./models/item');
//list to be filled with item objects from item.js in models
//var itemsList = [];
//below is an example of using the constructor of the object
// item.constructor(item_id, discriminator, properties (as an object));


//insert new items into db: GET requests

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

// Create a new music
router.get('/createitems/createMusic', function(req, res, next) {
    res.render('catalog/createMusic', { title: 'Create Item'});
});

// Create a new movie
router.get('/createitems/createMovie', function(req, res, next) {
    res.render('catalog/createMovie', { title: 'Create Item'});
});

//insert new items into db: POST requests

// Create a new book POST request
router.post('/createitems/createBook', async function (req, res) {

    const newItem = {
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
        console.log(newItem);
        catalog.insertNewBook(newItem);
        res.render('catalog/catalog', {title: 'Catalog'});
    }

    try {
        const client = await pool.connect();
        const result = await client.query("INSERT INTO Items (discriminator) VALUES ('Book');INSERT INTO Books (item_id, discriminator, quantity, loand_period, loanable, title, author, format, pages, publisher, language, isbn10, isbn13)"+"SELECT select_id,'Book',"+newItem.quantity+",7,TRUE,'"+newItem.title+"','" +newItem.author+ "','" +newItem.format+ "'," +newItem.pages+ ",'" +newItem.publisher+ "','" +newItem.language+ "', " +newItem.isbn10+ ", " +newItem.isbn13+ "FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
        );
        client.release();

    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }

});

//Create new Movie POST Request
router.post('/createitems/createMovie', async function (req, res) {

    const newItem = {
        "title": req.body.title,
        "director": req.body.director,
        "producers": req.body.producers,
        "language": req.body.language,
        "dubbed": req.body.dubbed,
        "subtitles": req.body.subtitles,
        "actors": req.body.actors,
        "release_date": req.body.release_date,
        "run_time": req.body.run_time,
        "quantity": req.body.quantity
    };

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('producers', 'Producers is required').notEmpty();
    req.checkBody('language', 'Language is required').notEmpty();
    req.checkBody('dubbed', 'Dubbed is required').notEmpty();
    req.checkBody('subtitles', 'Subtitles is required').notEmpty();
    req.checkBody('director', 'Director is required').notEmpty();
    req.checkBody('actors', 'Actors is required').notEmpty();
    req.checkBody('release_date', 'Release date is required').notEmpty();
    req.checkBody('run_time', 'Run time of the movie is required').notEmpty();
    req.checkBody('quantity', 'Quantity is required').notEmpty();

    const err = req.validationErrors();
    if (err) {
        res.render('catalog/createMovie', {errors: err, title: 'Create Item'});
    } else {
        console.log(newItem);
        catalog.insertNewBook(newItem);
        res.render('catalog/catalog', {title: 'Catalog'});
    }

    try {
        const client = await pool.connect();
        const result = await client.query("INSERT INTO Items (discriminator) VALUES ('Movie');INSERT INTO Movies (item_id, discriminator, quantity, loand_period, loanable, title, director, producers, language, dubbed, subtitles, actors, release_date, run_time) SELECT select_id, 'Movie',3,2,TRUE,'Spiderman 20','Clint Eastwood', 'Michael Kane', 'English', 'English', 'German', 'George Cloney, Brad Pitt', '2001-09-04', 133 FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
        );
        client.release();

    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }

});

//Create new Magazine POST request
router.post('/createitems/createMagazine', async function (req, res) {

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

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('publisher', 'Publisher is required').notEmpty();
    req.checkBody('language', 'Language is required').notEmpty();
    req.checkBody('isbn10', 'ISBN1O is required').notEmpty();
    req.checkBody('isbn13', 'ISBN13 is required').notEmpty();
    req.checkBody('loanable', 'Loanable is required').notEmpty();
    req.checkBody('loand_period', 'Loan period is required').notEmpty();
    req.checkBody('quantity', 'Quantity is required').notEmpty();

    const err = req.validationErrors();
    if (err) {
        res.render('catalog/createMagazine', {errors: err, title: 'Create Item'});
    } else {
        console.log(newItem);
        catalog.insertNewMagazine(newItem);
        res.render('catalog/catalog', {title: 'Catalog'});
    }

    try {
        const client = await pool.connect();
        const result = await client.query("INSERT INTO Items (discriminator) VALUES ('Magazine');INSERT INTO Magazine (item_id, discriminator, quantity, loand_period, loanable, title, publisher, language, isbn10, isbn13, release_date) "+"SELECT select_id,'Magazine',"+newItem.quantity+",7,TRUE,'"+newItem.title+"','" +newItem.publisher+ "','" +newItem.release_date+ "'," +newItem.isbn10+ ",'" +newItem.isbn13+ "',' " +newItem.loanable+ "FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
    );
        client.release();

    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }

});

//Create new Music POST request
router.post('/createitems/createMusic', async function(req, res){

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

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('artist', 'Artist is required').notEmpty();
    req.checkBody('run_time', 'Run time is required').notEmpty();
    req.checkBody('label', 'Label is required').notEmpty();
    req.checkBody('asin', 'ASIN is required').notEmpty();
    req.checkBody('loanable', 'Loanable is required').notEmpty();
    req.checkBody('loand_period', 'Loan period is required').notEmpty();
    req.checkBody('quantity', 'Quantity is required').notEmpty();
    req.checkBody('release_date', 'Release date is required').notEmpty();

    const err = req.validationErrors();
    if (err) {
        res.render('catalog/createMusic', {errors: err, title: 'Create Item'});
    } else {
        console.log(newItem);
        catalog.insertNewMusic(newItem);
        res.render('catalog/catalog', {title: 'Catalog'});
    }

    try {
        const client = await pool.connect();
        const result = await client.query("INSERT INTO Items (discriminator) VALUES ('Music');INSERT INTO Music (item_id, discriminator, quantity, loand_period, loanable, title, label, release_date, asin, run_time, artist) "+"SELECT select_id,'Magazine',"+newItem.quantity+",7,TRUE,'"+newItem.title+"','" +newItem.artist+ "','" +newItem.release_date+ "'," +newItem.asin+ ",'" +newItem.run_time+ "',' " +newItem.loanable+ "FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
        );
        client.release();

    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }

});

