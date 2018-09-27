var express = require('express');
var router = express.Router();

// DB connection
var connString = process.env.DATABASE_URL || 'postgres://hizxyalrympljm:3f4cd73544ce42e3aade5131e9d72f3d4032b8e69ac8fc37d8b8186cf3de4a3d@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d6a0flgsl8bp0c';
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

router.get('/manageusers', function(req, res, next) {
        res.render('manageusers.ejs', { title: 'Manage Users'})
})

// GET db page
router.get('/db', async (req, res) => {
	try {
                const client = await pool.connect()
                const result = await client.query('SELECT * FROM test_table');
                const results = { 'results': (result) ? result.rows : null};
                res.render('db', results );
                client.release();
	} catch (err) {
                console.error(err);
                res.send("Error " + err);
	}
})

module.exports = router;
