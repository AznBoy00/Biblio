var tdg = require('../TDG/itemsGateway');
var imap = require('../IMAP/identitymap');

// var item = require('../models/item');
//list to be filled with item objects from item.js in models
// var itemsList = [];
//below is an example of using the constructor of the object
// itemsList = item.constructor(item_id, discriminator, properties (as an object));

// ======================================== //
// = GET LIST OF ALL ITEMS IN THE CATALOG = //
// ======================================== //
// used in viewing the entire catalog page
module.exports.getCatalog = async function() {
    try {        
        let foundCatalog = await imap.findFullCatalog();
        let result;
        if (foundCatalog){
            //console.log("----------------------------------------------");
            //console.log("Catalog has already been loaded into the IMAP:");
            result = await imap.getFullCatalog();
            //console.log("Loading "+result.items.length+" items from the IMAP");
            //console.log("----------------------------------------------");
            // console.log(result);
        } else{
            // console.log("----------------------------------------------");
            // console.log("Catalog was not found in the IMAP:");
            result = await tdg.getCatalog();
            // console.log("Loading "+result.items.length+" items from the DB");
            // console.log("----------------------------------------------");
            // console.log(result);
            await imap.loadFullCatalog(result);
        }
        
        // if full catalog not found in imap, get from tdg
        //if (!foundCatalog)
        return await result;

        // else get full catalog from imap

    } catch (err) {
        console.error(err);
        // res.render('error', { error: err });
    }
}

//Get list of filtered catalog items by alphabets type = 1 is for ascending and type = 2 is for descending
module.exports.getCatalogAlphaOrder = async function(type) {
    try {
        //let foundCatalog = imap.checkFullCatalog();
        let result = await tdg.getCatalogAlphaOrder(type);

        // if full catalog not found in imap, get from tdg
        //if (!foundCatalog)
        return await result;

        // else get full catalog from imap

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
// used in view single item page
// IMAP.find
// if found IMAP.get() 
// if not found IMAP.add() then IMAP.get()
module.exports.getItemById = async function(item_id, discriminator) {
    try {
        let item;
        let found = await imap.find(item_id);
        if(found){
            // console.log("-------------------------------------");
            // console.log("Found Item In IMAP: loading from IMAP");
            item = await imap.get(item_id);
            // console.log(item.results[0]);
            // console.log("-------------------------------------");
            // If item found in IMAP, get from IMAP
        }else{
            let getFromTDG = await tdg.getItemByID(item_id, discriminator);
            await imap.addItemToMap(getFromTDG);
            
            // console.log("---------------------------------------");
            // console.log("Item not found in IMAP: Loading from DB");
            item = await imap.get(item_id);
            // console.log(item.results[0]);
            // console.log("---------------------------------------");
        }
        return await item;
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
        let updatedItem = await this.getItemFromForm(req);
        console.log("UPDATED: " + updatedItem.title);
        await imap.updateItem(updatedItem, item_id); // Update item on Imap.
        return tdg.updateItem(updatedItem, item_id, discriminator); // Update the item in the DB
        
    } catch (err) {
        console.error(err);
    }
}

// ====================================== //
// ====== Search Items Handler ======= //
// ====================================== //
module.exports.getSearchResults = async function(searched) {
    try {
        let search = searched.toLowerCase();
        let result = await tdg.getSearchResults(search);
        console.log("Result from model:", result);
        return await result;
    } catch (err) {
        console.error(err);
    }
}

// ====================================== //
// ====== Search Items Handler ======= //
// ====================================== //
module.exports.getSearchResultsTransactions = async function(req) {
    try {
        let searched = req.body.search;
        let search = searched.toLowerCase();
        let result;
        result = await tdg.getSearchResultTransactions(search, req);
        return await result;
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
        await imap.deleteItemFromMap(item_id); // Delete item from Imap.
        await tdg.deleteItem(item_id);
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
            //common attribute
            "quantity": req.body.quantity
        }
        return await newItem;
    } catch (err) {
        console.error(err);
    }
}
// ===============================================//
// === GET ALL TRANSACTIONS MADE ON THE SYSTEM == //
// ============================================== //
module.exports.getTransactionItems = async function() {
    try {        
        
        let result = await tdg.getAllTransactions();
        await imap.loadFullTransactionTable(result);
        return await result;
    } catch (err) {
        console.error(err);
    }
}

module.exports.getUserTransactionItems = async function(email) {
    try {        
        console.log("In get User Transaction" + email);
        let result = await tdg.getAllUserTransactions(email);
        await imap.loadFullTransactionTable(result);
        console.log("TSHLSJHDBJSHAD", result);

        return await result;
    } catch (err) {
        console.error(err);
    }
}

module.exports.filterTransactions = async function(req, asc) {
    try {        
        
        let result = await tdg.filterTransactions(req, asc);
        await imap.filterTransactionTable(result);

        let result2 = await imap.filterTransactionTable();
        return await result;
    } catch (err) {
        console.error(err);
    }
}