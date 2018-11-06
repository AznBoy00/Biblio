// DB Connection
const pool = require('../db');

var uow = require('../models/catalogUnitOfWork');

var item = require('../models/item');
//list to be filled with item objects from item.js in models
var itemsList = [];

//below is an example of using the constructor of the object
// itemsList = item.constructor(item_id, discriminator, properties (as an object));

// ======================================== //
// = GET LIST OF ALL ITEMS IN THE CATALOG = //
// ======================================== //
module.exports.getFullCatalog = async function() {
    try {        
        //open the connections, query the db, release the connection
        const client = await pool.connect();
        const resultBook = await client.query('SELECT * FROM books ORDER BY item_id ASC');
        const resultMagazine = await client.query('SELECT * FROM magazines ORDER BY item_id ASC');
        const resultMovie = await client.query('SELECT * FROM movies ORDER BY item_id ASC');
        const resultMusic = await client.query('SELECT * FROM music ORDER BY item_id ASC');
        client.release();
        
        let result = [];
        result.books = (resultBook != null) ? resultBook.rows : null;
        result.magazines = (resultMagazine != null) ? resultMagazine.rows : null;
        result.movies = (resultMovie != null) ? resultMovie.rows : null;
        result.musics = (resultMusic != null) ? resultMusic.rows : null;
        
        // console.log(result);
        return await result;
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
}
// ====================================== //
// ===== INSERT A NEW ITEM INTO DB ====== //
// ====================================== //
// insert into the items table dirst, then use the PSQL function to retrieve
// the items_item_id_seq (item_id) that was just inserted to create a new item.
module.exports.insertNewItem = async function(newItem, discriminator) {
    try {
        // change the disciminator to match the table name, add an S
        // to bookS, movieS, magazineS and leave music as is 
        let tableName =  (discriminator!= "Music") ? discriminator + "s" : discriminator;
        
        // build the query string in the format: 
        // "INSERT INTO tableName (select_id, attributes) SELECT attribute values"
        // "FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
        let query = "INSERT INTO " + tableName + " (item_id, ";
        for(var i in newItem){
            if(newItem[i] != null){
                query = query + i + ", ";
            }
        }
        query = query.slice(0, -2); //remove the last comma
        query = query + ") SELECT select_id, "
        for(var j in newItem){
            if(newItem[j] != null){
                query = query +"\'"+ newItem[j] + "\', ";
            }
        }
        query = query.slice(0, -2); //remove the last comma
        query = query + " FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
        console.log(query);
        // insert into the Item table first, in order to get the item_id later
        let itemQuery = "INSERT INTO Items (discriminator) VALUES (\'"+discriminator+"\');";
        // open the connection as late as possible
        const client = await pool.connect();
        // now query the database with the pre-built string
        await client.query(itemQuery);
        await client.query(query);
        client.release();
    } catch (err) {
        console.error(err);
    }
};

// ====================================== //
// ===== GET ITEM BASED ON ITEM_ID ====== //
// ====================================== //
module.exports.getItemById = async function(item_id) {
    try {
        let discriminator = await this.getDiscriminator(item_id);
        let tableName =  (discriminator!= "Music") ? discriminator + "s" : discriminator;

        let query = "SELECT * FROM " + tableName + " WHERE item_id = " + item_id;
        const client = await pool.connect()
        let result = await client.query(query);
        client.release();
        const results = { 'results': (result) ? result.rows : null};
        return await results;
    } catch (err) {
        console.error(err);
    }
}

// ====================================== //
// = GET ITEM DISCRIMINATOR BASED ON ID = //
// ====================================== //
module.exports.getDiscriminator = async function(item_id) {
    try {
        let query = "SELECT discriminator FROM Items WHERE "+item_id+";";
        const client = await pool.connect();
        let result = await client.query(query);
        client.release();
        var resultJSON = { 'result': (await result) ? await result.rows : null};
        return await resultJSON.result[0].discriminator;
    } catch (err) {
        console.error(err);
    }
}

// ====================================== //
// === GET NEW ITEM FROM THE HTML FORM == //
// ====================================== //
// get a new item passed in from the HTML FORM
module.exports.getItemFromForm = async function(req) {
    let newItem;
    try {
        newItem = await {
            // book and magazine related attributes
            "title": req.body.title,
            "author": req.body.author,
            "format": req.body.format,
            "pages": req.body.pages,
            "publisher": req.body.publisher,
            "language": req.body.language,
            "isbn10": req.body.isbn10,
            "isbn13": req.body.isbn13,
            "loanable": req.body.loanable,
            "loan_period": req.body.loan_period,
            // movie related attributes
            "director": req.body.director,
            "producers": req.body.producers,
            "subtitles": req.body.subtitles,
            "dubbed": req.body.dubbed,
            "actors": req.body.actors,
            "release_date": req.body.release_date,
            "run_time": req.body.run_time,
            // music related attributes
            "artist": req.body.artist,
            "type": req.body.type,
            "label": req.body.label,
            "asin": req.body.asin,
        }
        return await newItem;
    } catch (err) {
        console.error(err);
    }
}

// ====================================== //
// ====== UPDATE AN EXISTING ITEM ======= //
// ====================================== //
module.exports.updateItem = async function(newItem, item_id) {
    try {
        let tableName = await this.getDiscriminator(item_id);
        // change the disciminator to match the table name, add an S
        // to bookS, movieS, magazineS and leave music as is 
        if (tableName != "Music")
            tableName = tableName + "s";
        
        // build the query string
        let query = "UPDATE " + tableName + " SET ";
        for(var i in newItem){
            if(newItem[i] != null){
                query = query + i + " = \'" + newItem[i] + "\', ";
                // console.log(i+": "+newItem[i]);
            }
        }
        query = query.slice(0, -2); //remove the last comma
        query = query + " WHERE item_id = " + item_id + ";";
        // console.log(query);
        
        // open the connection as late as possible
        const client = await pool.connect();
        // now query the database with the pre-built string
        await client.query(query);
        client.release();
    } catch (err) {
        console.error(err);
    }
}

// ====================================== //
// ===== Delet an Item from the DB ====== //
// ====================================== //
// DELETE an ITEM from the database which
// cascades down to delete the corresponding
// book, magazine, movie or music
module.exports.deleteItem = async function (item_id){
    try {
        const client = await pool.connect();
        let result = await client.query(
            "DELETE FROM Items WHERE item_id=($1);", [item_id]
        );
        var resultJSON = { 'result': (await result) ? await result.rows : null};
        client.release();
        return await resultJSON.result[0].discriminator;
    } catch (err) {
        console.error(err);
    }        
}

