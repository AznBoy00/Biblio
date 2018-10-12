var item = require('../models/item');

// DB connection
var connString = process.env.DATABASE_URL || 'postgres://hizxyalrympljm:3f4cd73544ce42e3aade5131e9d72f3d4032b8e69ac8fc37d8b8186cf3de4a3d@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d6a0flgsl8bp0c';
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: connString,
    ssl: true
});

//list to be filled with item objects from item.js in models
var itemsList = [];

//below is an example of using the constructor of the object
// item.constructor(item_id, discriminator, properties (as an object));

//insert new book
module.exports.insertNewBook = async function(newbook) {
    try {
        const client = await pool.connect();

        const newitem = await client.query(
            "INSERT INTO Items (discriminator) VALUE ('Book')",
            function(err, result) {
                if (err)
                    console.log(err);
                else
                    console.log(newitem);
            }
        );

        const itemid = await client.query(
            "SELECT MAX(item_id) FROM Items",
            function(err, result) {
                if (err)
                    console.log(err);
                else
                    console.log(itemid);
            }
        );

        const result = await client.query(
            "INSERT INTO Books (book_id, quantity, title, author, format, pages, publisher, language, isbn10, isbn13) VALUES ('"
            + itemid + "','"
            + newbook.quantity + "','"
            + newbook.title + "','"
            + newbook.author+ "','"
            + newbook.format + "','"
            + newbook.pages + "','"
            + newbook.publisher + "','"
            + newbook.language + "','"
            + newbook.isbn10 + "','"
            + newbook.isbn13 + "')" ,function(err, result){
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
            }
        });

    } catch (err) {
        console.error(err);
    }
};
