// DB Connection
const pool = require('../db');

// getCatalog Module
    //For security purposes, a template query with tableName as paramater was not used. 
    //This could lead to injections
    module.exports.getCatalog = async function(){
        const client = await pool.connect();
        const resultBook = await client.query('SELECT * FROM books ORDER BY item_id ASC');
        const resultMagazine = await client.query('SELECT * FROM magazines ORDER BY item_id ASC');
        const resultMovie = await client.query('SELECT * FROM movies ORDER BY item_id ASC');
        const resultMusic = await client.query('SELECT * FROM music ORDER BY item_id ASC');
        client.release();
        
        let result = [resultBook];
        result.books = (resultBook != null) ? resultBook.rows : null;
        result.magazines = (resultMagazine != null) ? resultMagazine.rows : null;
        result.movies = (resultMovie != null) ? resultMovie.rows : null;
        result.musics = (resultMusic != null) ? resultMusic.rows : null;

        return result;
    }

// insertNewItem Module
    module.exports.insertNewItem = async function(newItem,req, discriminator){
        // change the disciminator to match the table name, add an S
        // to bookS, movieS, magazineS and leave music as is 
        let tableName =  (discriminator!= "Music") ? discriminator + "s" : discriminator;
        
        // build the query string in the format: 
        // insert into the Item table first, in order to get the item_id later
        let itemQuery = "INSERT INTO Items (discriminator) VALUES (\'"+discriminator+"\');";
        let query = "INSERT INTO " + tableName + " (item_id, ";
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
        result.insert1 =  client.query(itemQuery);
        result.insert2 = client.query(query);
        client.release();        
        
        return result;
    }

// getItemById Module
    //For security purposes, a template query with tableName as paramater was not used. 
    //This could lead to injections

    module.exports.getItemByID = async function(item_id){
        let discriminator = await this.getDiscriminator(item_id);
        let tableName =  (discriminator!= "Music") ? discriminator + "s" : discriminator;

        let query = "SELECT * FROM " + tableName + " WHERE item_id = " + item_id + ";";
        const client = await pool.connect()
        let result = await client.query(query);
        client.release();
        const results = { 'results': (result) ? result.rows : null};

        return true;

    }

    //getDiscriminator Module

    module.exports.getDiscriminator = async function(item_id){
        let query = "SELECT discriminator FROM Items WHERE item_id = "+item_id+";";
        const client = await pool.connect();
        let result = await client.query(query);
        client.release();
        var resultJSON = { 'result': (await result) ? await result.rows : null};
        return await resultJSON.result[0].discriminator;

        return { 'result': (await result) ? await result.rows : null}
    }

    //updateItem Module
    module.exports.updateBook = async function(item_id){
        return query(
            "UPDATE books SET " +
            "title = '"+ newItem.title + "', " +
            "author = '" + newItem.author + "', " +
            "format = '" + newItem.format + "', " +
            "pages = " + newItem.pages + ", " +
            "publisher = '" + newItem.publisher + "', " +
            "language = '" + newItem.language + "', " +
            "isbn10 = " + newItem.isbn10 + ", " +
            "isbn13 = " + newItem.isbn13 + ", " +
            "loanable = '" + newItem.loanable + "', " +
            "loan_period = " + newItem.loan_period +
            " WHERE item_id = ($1);", [item_id]
        );
    }

    module.exports.updateMagazine = async function(item_id){
        return query(
            "UPDATE magazines SET " +
            "title = '"+ newItem.title + "', " +
            "publisher = '" + newItem.publisher + "', " +
            "language = '" + newItem.language + "', " +
            "isbn10 = " + newItem.isbn10 + ", " +
            "isbn13 = " + newItem.isbn13 + ", " +
            "loanable = '" + newItem.loanable + "', " +
            "loan_period = " + newItem.loan_period +
            " WHERE item_id = ($1);", [item_id]
        );
    }

    module.exports.updateMovie = async function(item_id){
        return query(
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
            "loan_period = " + newItem.loan_period +
            " WHERE item_id = ($1);", [item_id]
        );
    }

    module.exports.updateMusic = async function(item_id){
        query(
            "UPDATE music SET " +
            "title = '"+ newItem.title + "', " +
            "artist = '" + newItem.artist + "', " +
            "type = '" + newItem.type + "', " +
            "label = '" + newItem.label + "', " +
            "release_date = '" + newItem.release_date + "', " +
            "asin = '" + newItem.asin + "', " +
            "loanable = '" + newItem.loanable + "', " +
            "loan_period = " + newItem.loan_period +
            " WHERE item_id = ($1);", [item_id]
        );
    }

    //delete Module
    module.exports.delete = async function(item_id){
        return query("DELETE FROM Items WHERE item_id=($1);", [item_id]);
    }

