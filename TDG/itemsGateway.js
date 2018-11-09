// DB Connection
const pool = require('../db');

// getCatalog Module
module.exports.getCatalog = async function(){
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

    return result;
}

// insertNewItem Module
module.exports.insertNewItem = async function(newItem,req, discriminator){

    // build the query string in the format: 
    // insert into the Item table first, in order to get the item_id later
    let itemQuery = "INSERT INTO Items (discriminator) VALUES (\'"+discriminator+"\');";
    let query = "INSERT INTO " + discriminator + " (item_id, ";
    // iterate over attribute names
    for(var i in newItem){
        if(newItem[i] != null){
            query = query + i + ", ";
        }
    }
        //remove the last comma
    query = query.slice(0, -2);
    query = query + ") SELECT select_id, "
    // iterate over attribute values
    for(var j in newItem){
        if(newItem[j] != null){
            query = query +"\'"+ newItem[j] + "\', ";
        }
    }
    //remove the last comma
    query = query.slice(0, -2);
    query = query + " FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
    
    let result = [];
    // open the connection as late as possible
    const client = await pool.connect();
    // now query the database with the pre-built string
    result.insert1 = await client.query(itemQuery);
    result.insert2 = await client.query(query);
    result.item_id = await client.query('SELECT CURRVAL(\'items_item_id_seq\')');
    client.release();        
    
    return result;
}

// getItemByID Module
module.exports.getItemByID = async function(item_id, discriminator){

    let query = "SELECT * FROM " + discriminator + " WHERE item_id = " + item_id + ";";
    
    const client = await pool.connect()
    let result = await client.query(query);
    client.release();

    const results = { 'results': (result) ? result.rows : null};
    return await results;
}

//updateItem Module
module.exports.updateItem = async function(newItem, item_id, discriminator){

    // build the query string
    let query = "UPDATE " + discriminator + " SET ";
    for(var i in newItem){
        if(newItem[i] != null){
            // set attribute name = attribute value
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
    let result = await client.query(query);
    // close the connection
    client.release();

    return result;
}    

//delete Module
module.exports.deleteItem = async function(item_id){
    let query = "DELETE FROM Items WHERE item_id = " + item_id + ";"
    
    const client = await pool.connect();
    let result = await client.query(query);
    client.release();
}

