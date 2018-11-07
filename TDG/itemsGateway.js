// DB Connection
const pool = require('../db');

// getCatalog Module
    //For security purposes, a template query with tableName as paramater was not used. 
    //This could lead to injections

    exports.getAllBooks = function(){
          return query('SELECT * FROM books ORDER BY item_id ASC');
    },

    exports.getAllMagazines = function(){
        return query('SELECT * FROM magazines ORDER BY item_id ASC');
    },

    exports.getAllMovies = function(){
        return query('SELECT * FROM movies ORDER BY item_id ASC');
    },

    exports.getAllMusic = function(){
        return query('SELECT * FROM music ORDER BY item_id ASC');
    },

// insertNewItem Module
    exports.insertBookItem = function(discriminator){
        return query("INSERT INTO Items (discriminator) VALUES ('Book');");
    },

    exports.insertBook = function(newItem){
        return query(
            "INSERT INTO books (item_id , pages ," +
            "title, author, format, publisher, language, isbn10, isbn13)" +
            " SELECT select_id, "+
            "" + newItem.pages + ", " +
            "'" + newItem.title + "', " +
            "'" + newItem.author + "', " +
            "'" + newItem.format + "', " +
            "'" + newItem.publisher + "', " +
            "'" + newItem.language + "', " +
            newItem.isbn10 + ", " +
            newItem.isbn13 +
            " FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
        );
    },

    exports.insertMagazineItem = function(discriminator){
        return query("INSERT INTO Items (discriminator) VALUES ('Magazine');");
    },

    exports.insertMagazine = function(newItem){
        return query(
            "INSERT INTO magazines (item_id, " +
            "title, publisher, language, isbn10, isbn13)" +
            " SELECT select_id, "+
            "'" + newItem.title + "', " +
            "'" + newItem.publisher + "', " +
            "'" + newItem.language + "', " +
            "'" + newItem.isbn10 + "', " +
            "'" + newItem.isbn13 + "' " +
            "FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
        );
    },

    exports.insertMovieItem = function(discriminator){
        return query("INSERT INTO Items (discriminator) VALUES ('Movie');");
    },

    exports.insertMovie = function(newItem){
        return query(
            "INSERT INTO movies (item_id, run_time, title, " +
            "director, producers, actors, language, dubbed, subtitles, release_date) " +
            "SELECT select_id, "+
            newItem.run_time + ", " +
            "'" + newItem.title + "', " +
            "'" + newItem.director + "', " +
            "'" + newItem.producers + "', " +
            "'" + newItem.actors + "', " +
            "'" + newItem.language + "', " +
            "'" + newItem.dubbed + "', " +
            "'" + newItem.subtitles + "', " +
            "'" + newItem.release_date + "' " +
            "FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
        );
    },

    exports.insertMusicItem = function(discriminator){
        return query("INSERT INTO Items (discriminator) VALUES ('Music');");
    },

    exports.insertMusic = function(newItem){
        return query(
            "INSERT INTO music (item_id, " +
            "type, title, artist, label, release_date, asin)" +
            " SELECT select_id, "+
            "'" + newItem.type + "', " +
            "'" + newItem.title + "', " +
            "'" + newItem.artist + "', " +
            "'" + newItem.label + "', " +
            "'" + newItem.release_date + "', " +
            "'" + newItem.asin + "' " +
            "FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;"
        );
    },

// getItemById Module
    //For security purposes, a template query with tableName as paramater was not used. 
    //This could lead to injections

    exports.getBook = function(item_id){
        return query("SELECT * FROM books WHERE item_id = ($1)", [item_id]);
    },

    exports.getMagazine = function(item_id){
        return query("SELECT * FROM magazines WHERE item_id = ($1)", [item_id]);
    },

    exports.getMovie = function(item_id){
        return query("SELECT * FROM movies WHERE item_id = ($1)", [item_id]);
    },

    exports.getMusic = function(item_id){
        return query("SELECT * FROM music WHERE item_id = ($1)", [item_id]);
    },

//getDiscriminator Module

    exports.discriminator = function(item_id){
        return query("SELECT discriminator FROM Items WHERE item_id=$1;", [item_id]);
    },

//updateItem Module
    exports.updateBook = function(item_id){
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
    },

    exports.updateMagazine = function(item_id){
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
    },

    exports.updateMovie = function(item_id){
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
    },

    exports.updateMusic = function(item_id){
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
    },

    //delete Module
    exports.delete = function(item_id){
        return query("DELETE FROM Items WHERE item_id=($1);", [item_id]);
    }
