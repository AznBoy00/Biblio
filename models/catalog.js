// DB Connection
const pool = require('../db');
var tdg = require('../TDG/itemsGateway');

// var item = require('../models/item');
//list to be filled with item objects from item.js in models
// var itemsList = [];
//below is an example of using the constructor of the object
// itemsList = item.constructor(item_id, discriminator, properties (as an object));

// ======================================== //
// = GET LIST OF ALL ITEMS IN THE CATALOG = //
// ======================================== //
module.exports.getCatalog = async function() {
    try {        
        return await tdg.getCatalog();
    } catch (err) {
        console.error(err);
        // res.render('error', { error: err });
    }
}
// ====================================== //
// ===== INSERT A NEW ITEM INTO DB ====== //
// ====================================== //
// insert into the items table dirst, then use the PSQL function to retrieve
// the items_item_id_seq (item_id) that was just inserted to create a new item.
module.exports.insertNewItem = async function(req, discriminator) {
    try {
        // get the item fromt he html form
        let newItem = await this.getItemFromForm(req);
        return await tdg.insertNewItem(newItem,req, discriminator);
    } catch (err) {
        console.error(err);
    }
};

// ====================================== //
// ===== GET ITEM BASED ON ITEM_ID ====== //
// ====================================== //
module.exports.getItemById = async function(item_id, discriminator) {
    try {
        return await tdg.getItemByID(item_id, discriminator);
    } catch (err) {
        console.error(err);
    }
}


// ====================================== //
// ====== UPDATE AN EXISTING ITEM ======= //
// ====================================== //
module.exports.updateItem = async function(req, item_id, discriminator) {
    try {
        // get the item fromt he html form
        let newItem = await this.getItemFromForm(req);

        return tdg.updateItem(newItem, item_id, discriminator);
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
        return await tdg.deleteItem(item_id);
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