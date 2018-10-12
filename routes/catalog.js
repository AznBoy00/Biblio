//to access the routes in this class, include /catalog/{ROUTE_FROM_THIS_FILE} in your URL
var express = require('express');
var router = express.Router();

// DB connection
var connString = 'postgres://hizxyalrympljm:3f4cd73544ce42e3aade5131e9d72f3d4032b8e69ac8fc37d8b8186cf3de4a3d@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d6a0flgsl8bp0c' || process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({
  	connectionString: connString,
  	ssl: true
});
// manageusers page
router.get('/update/:item_id', async (req, res) => {
	try {
        const client = await pool.connect()
        const result = await client.query("SELECT * FROM books WHERE book_id = ($1)", [req.params.item_id]);
        const results = { 'results': (result) ? result.rows : null};
        res.render('updateitem.ejs', results );
        client.release();
	} catch (err) {
        console.error(err);
        res.send("Error " + err);
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
        res.redirect('/catalog');
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


//keep the next line at the end of this script
module.exports = router;
