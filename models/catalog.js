// DB Connection
const pool = require('../db');

var item = require('../models/item');
//list to be filled with item objects from item.js in models
var itemsList = [];

//below is an example of using the constructor of the object
// item.constructor(item_id, discriminator, properties (as an object));

//insert new book
module.exports.insertNewBook = async function(newbook) {
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

        const newitem = await client.query(
            "INSERT INTO Items (item_id, discriminator) VALUES (" + itemid[0] + ", 'Book')",
            function(err, result) {
                if (err)
                    console.log(err);
                else
                    console.log(newitem);
            }
        );

        // const result = await client.query(
        //     "INSERT INTO Books (book_id, quantity, title, author, format, pages, publisher, language, isbn10, isbn13) VALUES ("
        //                 + itemid + ","
        //                 + newbook.quantity + ",'"
        //                 + newbook.title + "','"
        //                 + newbook.author+ "','"
        //                 + newbook.format + "',"
        //                 + newbook.pages + ",'"
        //                 + newbook.publisher + "','"
        //                 + newbook.language + "',"
        //                 + newbook.isbn10 + ","
        //                 + newbook.isbn13 + ")" ,            
        //     function(err, result){
        //         if (err) {
        //             console.log(err);
        //         }
        //         else {
        //             console.log(result);
        //         }
        //     });
        } catch (err) {
            console.error(err);
        }
};
