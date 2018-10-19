// DB connection
var connString = process.env.DATABASE_URL || 'postgres://hizxyalrympljm:3f4cd73544ce42e3aade5131e9d72f3d4032b8e69ac8fc37d8b8186cf3de4a3d@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d6a0flgsl8bp0c';
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: connString,
    ssl: true
});


//Create new book: Post request

var item = require('../models/item');

// Create


//insert new book

module.exports.insertNewItem = async function(newItem) {
    try {
        const client = await pool.connect();

        let itemid = await client.query(
            "SELECT MAX(item_id) FROM Items;",
            function(err, result) {
                if (err)
                    console.log(err);
                else
                    console.log(itemid);
            }
        );

        itemid = itemid + 1;

        const newItem = await client.query(
            "INSERT INTO Items (item_id, discriminator) VALUES (" + itemid[0] + ", 'Items')",
            function(err, result) {
                if (err)
                    console.log(err);
                else
                    console.log('1 record inserted');
            }
        );

        const result = await client.query("INSERT INTO Book (discriminator) VALUES ("
                         + itemid + ","
                       + newbook.quantity + ",'"
                       + newbook.title + "','"
                        + newbook.author+ "','"
                + newbook.format + "',"
                         + newbook.pages + ",'"
                         + newbook.publisher + "','"
                         + newbook.language + "',"
                         + newbook.isbn10 + ","
                         + newbook.isbn13 + ")" ,
             function(err, result){
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

//Insert new book into db (without using Item table)
module.exports.insertNewBook = async function(newBook) {
    try {
        const client = await pool.connect();
            const result = await client.query("INSERT INTO Book (title, author, format, pages, publisher, language, isbn10, isbn13, quantity) VALUES ('"
                + newBook.title + "','"
                + newBook.author + "','"
                + newBook.format+ "','"
                + newBook.pages + "','"
                + newBook.publisher + "','"
                + newBook.language + "','"
                + newBook.isbn10 + "','"
                + newBook.isbn13 + "','"
                + newBook.quantity + "')" ,function(err, result){
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(result);
                }
            });

    } catch (err) {
        console.error(err);
        res.send(err);
    }
};

//Insert new magazine into db (without using Item table)
module.exports.insertNewMagazine = async function(newMagazine) {
    try {
        const client = await pool.connect();
            const result = await client.query("INSERT INTO Magazine (title, artist, label, releaseDate, language, quantity, asin) VALUES ('"
                + newMagazine.title + "','"
                + newMagazine.artist + "','"
                + newMagazine.label+ "','"
                + newMagazine.releaseDate + "','"
                + newMagazine.publisher + "','"
                + newMagazine.language + "','"
                + newMagazine.quantity + "','"
                + newMagazine.asin + "')" ,function(err, result){
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(result);
                }
            });

    } catch (err) {
        console.error(err);
        res.send(err);
    }
};







