// DB Connection
const pool = require('../db');

var item = require('../models/item');
//list to be filled with item objects from item.js in models
var itemsList = [];

//below is an example of using the constructor of the object
// item.constructor(item_id, discriminator, properties (as an object));

//Get list of catalog items
module.exports.getCatalog = async function() {
    try {
        const client = await pool.connect();
        let result = [];
        const resultBook = await client.query('SELECT * FROM books');
        const resultMagazine = await client.query('SELECT * FROM magazines ');
        const resultMovie = await client.query('SELECT * FROM movies ');
        const resultMusic = await client.query('SELECT * FROM music ');

        result.resultBooks = { 'resultBooks': (resultBook) ? resultBook.rows : null};
        result.resultMagazines = { 'resultMagazines': (resultMagazine) ? resultMagazine.rows : null};
        result.resultMovies = { 'resultMovies': (resultMovie) ? resultMovie.rows : null};
        result.resultMusics = { 'resultMusics': (resultMusic) ? resultMusic.rows : null};
        client.release();
        //console.log(list);
        return await result;
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
}

//insert new book
module.exports.insertNewBook = async function(newbook) {
    try {
        const client = await pool.connect();

        const itemid = await client.query(
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
}

/**
 * getItem(item_id, discriminator)
 * Discriminator: 1 = books, 2 = magazines, 3 = movies, 4 = music
 **/
module.exports.getItem = async function(item_id) {
    //console.error(getDiscriminator(item_id));
    try {
        const client = await pool.connect()
        let result;
        let discriminator = await this.getDiscriminator(item_id);
        switch(discriminator) {
            case "Book":
                result = await client.query("SELECT * FROM books WHERE book_id = ($1)", [item_id]);
                break;
            case "Magazine":
                result = await client.query("SELECT * FROM magazines WHERE magazine_id = ($1)", [item_id]);
                break;
            case "Movie":
                result = await client.query("SELECT * FROM movies WHERE movie_id = ($1)", [item_id]);
                break;
            case "Music":
                result = await client.query("SELECT * FROM music WHERE music_id = ($1)", [item_id]);
                break;
            default:
                result = null;
                break;
        }
        const results = { 'results': (result) ? result.rows : null};
        client.release();
        return await results;
    } catch (err) {
        console.error(err);
	}
}

//Getter for discriminator
module.exports.getDiscriminator = async function(item_id) {
    try {
        const client = await pool.connect();
        let result = await client.query(
            "SELECT discriminator FROM Items WHERE item_id=$1;", [item_id]
        );
        var resultJSON = { 'result': (await result) ? await result.rows : null};
        client.release();
        return await resultJSON.result[0].discriminator;
    } catch (err) {
        console.error(err);
    }
}

//async function getItem

// updateItem to database; Discriminator: 1 = books, 2 = magazines, 3 = movies, 4 = music
module.exports.updateItem = async function(newItem, item_id, discriminator) {
    try {
        const client = await pool.connect();
        let result;
        switch (discriminator) {
            case 1:
                result = await client.query(
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
                    " WHERE book_id = ($1);", [item_id]  
                );
                break;
            case 2:
                result = await client.query(
                    "UPDATE magazines SET " +
                    "title = '"+ newItem.title + "', " +
                    "publisher = '" + newItem.publisher + "', " +
                    "language = '" + newItem.language + "', " +
                    "isbn10 = " + newItem.isbn10 + ", " +
                    "isbn13 = " + newItem.isbn13 + ", " +
                    "loanable = '" + newItem.loanable + "', " +
                    "loand_period = " + newItem.loand_period + ", " + 
                    "quantity = "+ newItem.quantity +
                    " WHERE magazine_id = ($1);", [item_id]  
                );
                break;
            case 3:
                result = await client.query(
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
                    " WHERE movie_id = ($1);", [item_id]
                );
                break;
            case 4:
                result = await client.query(
                    "UPDATE music SET " +
                    "title = '"+ newItem.title + "', " +
                    "artist = '" + newItem.artist + "', " +
                    "label = '" + newItem.label + "', " +
                    "release_date = '" + newItem.release_date + "', " +
                    "asin = '" + newItem.asin + "', " +
                    "loanable = '" + newItem.loanable + "', " +
                    "loand_period = " + newItem.loand_period + ", " + 
                    "quantity = "+ newItem.quantity +
                    " WHERE music_id = ($1);", [item_id]  
                );
                break;
            default:
                result = null;
                break;
        }
        client.release();
    } catch (err) {
        console.error(err);
    }
}