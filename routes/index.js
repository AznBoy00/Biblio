var express = require('express');
var router = express.Router();

// DB connection
var connString = 'postgres://hizxyalrympljm:3f4cd73544ce42e3aade5131e9d72f3d4032b8e69ac8fc37d8b8186cf3de4a3d@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d6a0flgsl8bp0c' || process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({
  	connectionString: connString,
  	ssl: true
});

// GET homepage
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/login', function(req, res, next) {
        res.render('login.ejs', { title: 'Login' });
});

router.get('/signup', function(req, res, next) {
        res.render('signup.ejs', { title: 'Register' });
});

router.get('/usercp', function(req, res, next) {
        res.render('usercp.ejs', { title: 'UserCP'});
});

router.get('/catalog', async (req, res) => {
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
                
                // var lists = JSON.stringify(list)
                res.render('itemDisplay.ejs', {list: list});
                client.release();
                // console.log(list.resultBooks);
                // console.log(list.resultMagazines);
                // console.log(list.resultMovies);
                // console.log(list.resultMusics);
        } catch (err) {
                console.error(err);
                res.send("Error " + err);
        }

});

// manageusers page
router.get('/admincp/manageusers', async (req, res) => {
	try {
                const client = await pool.connect()
                const result = await client.query('SELECT * FROM users ORDER BY userid');
                const results = { 'results': (result) ? result.rows : null};
                res.render('manageusers.ejs', results );
                client.release();
	} catch (err) {
                console.error(err);
                res.send("Error " + err);
	}
});

// promote/demote users to admin page
router.get('/manageusers/promote/:userid', async (req, res) => {
	try {
                const client = await pool.connect()
                const result = await client.query("UPDATE users SET is_admin = 't' WHERE userid = ($1)", [req.params.userid]);
                const fname = req.params.fname;
                res.redirect('/manageusers');
                client.release();
	} catch (err) {
                console.error(err);
                res.send("Error " + err);
	}
});

router.get('/manageusers/demote/:userid', async (req, res) => {
	try {
                const client = await pool.connect()
                const result = await client.query("UPDATE users SET is_admin = 'f' WHERE userid = ($1)", [req.params.userid]);
                const fname = req.params.fname;
                res.redirect('/manageusers');
                client.release();
	} catch (err) {
                console.error(err);
                res.send("Error " + err);
	}
});

// GET db page
router.get('/db', async (req, res) => {
	try {
                const client = await pool.connect();
                const result = await client.query('SELECT * FROM Users');
                const results = { 'results': (result) ? result.rows : null};
                res.render('db', results );
                client.release();
	} catch (err) {
                console.error(err);
                res.send("Error " + err);
	}
});

module.exports = router;
