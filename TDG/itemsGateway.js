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
    result.items = (resultBook != null) ? resultBook.rows : null;
    (resultMagazine != null) ? result.items = result.items.concat(resultMagazine.rows) : null;
    (resultMovie != null) ? result.items = result.items.concat(resultMovie.rows) : null;
    (resultMusic != null) ? result.items = result.items.concat(resultMusic.rows) : null;

    return result;
}

//filter Module
module.exports.getCatalogAlphaOrder = async function(type){
    const client = await pool.connect();
    const resultBook = await client.query('SELECT item_id, discriminator, title, author FROM books ' +
        'UNION SELECT item_id, discriminator, title, publisher FROM magazines ' +
        'UNION SELECT item_id, discriminator, title, director FROM movies ' +
        'UNION SELECT item_id, discriminator, title, artist FROM music ORDER BY title  ' + (type === '1' ? 'ASC' : 'DESC'));
    client.release();

    let result = [];
    result.items = (resultBook != null) ? resultBook.rows : [];

    return result;
}

module.exports.getSearchResults = async function(search) {
    const client = await pool.connect();
    const resultBook = await client.query('SELECT * FROM books WHERE Lower(title) LIKE \'%' + search + '%\' OR LOWER(author) LIKE \'%'+ search +'%\' ORDER BY item_id ASC');
    const resultMagazine = await client.query("SELECT * FROM magazines WHERE Lower(title) LIKE '%" + search + "%' ORDER BY item_id ASC");
    const resultMovie = await client.query("SELECT * FROM movies WHERE Lower(title) LIKE '%" + search + "%' OR LOWER(director) LIKE '%"+search+"%' OR LOWER(producers) LIKE '%"+search+"%' ORDER BY item_id ASC");
    const resultMusic = await client.query("SELECT * FROM music WHERE Lower(title) LIKE '%" + search + "%' OR LOWER(artist) LIKE '%"+search+"%' OR LOWER(label) LIKE '%"+search+"%' ORDER BY item_id ASC");
    client.release();
    let result = [];
    result.items = (resultBook != null) ? resultBook.rows : null;
    (resultMagazine != null) ? result.items = result.items.concat(resultMagazine.rows) : null;
    (resultMovie != null) ? result.items = result.items.concat(resultMovie.rows) : null;
    (resultMusic != null) ? result.items = result.items.concat(resultMusic.rows) : null;

    return await result;
}

module.exports.getSearchResultTransactions = async function(search, req) {
    this.createTransactionViewTable();
    let resultSearch;
    const client = await pool.connect();
    if (req.session.is_Admin) {
        resultSearch = await client.query("SELECT * FROM transactions_view WHERE Lower(movie_title) LIKE '%" + search + "%' OR LOWER(book_title) LIKE '%" + search + "%' OR LOWER(music_title) LIKE '%" + search + "%';");
    } else {
        resultSearch = await client.query("SELECT * FROM transactions_view WHERE Lower(movie_title) LIKE '%" + search + "%' OR LOWER(book_title) LIKE '%" + search + "%' OR LOWER(music_title) LIKE '%" + search + "%' INTERSECT SELECT * FROM transactions_view WHERE email = '"+ req.session.email +"';");
    }
    client.release();
    
    let result = [];
    result.items = (resultSearch != null) ? resultSearch.rows : null;
    console.log("My Search Result: " + result);
    return await result;
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

module.exports.getAllTransactions = async function(){
    
    this.createTransactionViewTable();
    
    const client = await pool.connect();
    const result1 = await client.query("SELECT * FROM transactions_view ORDER BY loan_date ASC;");
    client.release();
    
    let result = [];
    result.items = (result1 != null) ? result1.rows : null;
    return result;
}

module.exports.getAllUserTransactions = async function(email){
    
    this.createTransactionViewTable();
    console.log("EMAIL: " + email);
    const client = await pool.connect();
    const result1 = await client.query("SELECT * FROM transactions_view WHERE email = '" + email + "' ORDER BY loan_date ASC;");
    client.release();
    
    console.log("TDG RESULT", result1)
    
    let result = [];
    result.items = (result1 != null) ? result1.rows : null;
    return result;
}


module.exports.filterTransactions = async function(req, asc) {
    this.createTransactionViewTable();
    const filterType = req.params.f;
    let result1;

    const client = await pool.connect();
    let order;

    if(asc){order = "ASC"} else {order = "DSC"}

    if(req.session.is_admin) {
        result1 = await client.query("SELECT * FROM transactions_view ORDER BY " + filterType +" "+ order + ";");
    }else{
        result1 = await client.query("SELECT * FROM transactions_view WHERE email = '"+ req.session.email+"' ORDER BY " + filterType +" "+ order + ";");
    }
    client.release();
    
    let result = [];
    result.items = (result1 != null) ? result1.rows : null;
    return result;


}

module.exports.createTransactionViewTable = async function() {
    const client = await pool.connect();
    try{
        const checkTableExists = await client.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables  WHERE table_schema = 'public' AND table_name = 'transactions_view');");
        
        //Check is the Table Exists before recreating it
        if(!checkTableExists.rows[0].exists) {
            const result1 = await client.query("CREATE VIEW transactions_view AS "+
            "SELECT DISTINCT transactions.transaction_id, transactions.client_id, transactions.item_id, " +
            "users.f_name, users.l_name, users.email,transactions.loan_date, transactions.due_date, " +
            "transactions.return_date, (SELECT title FROM Books, users Where users.user_id = transactions.client_id AND books.item_id = transactions.item_id) AS book_title, "+
            "(SELECT title FROM Music, users Where users.user_id = transactions.client_id AND music.item_id = transactions.item_id) AS music_title, " +
            "(SELECT title FROM movies, users Where users.user_id = transactions.client_id AND movies.item_id = transactions.item_id) AS movie_title " +
            "FROM transactions, music, movies, books, users " +
            "Where (users.user_id = transactions.client_id AND books.item_id = transactions.item_id) " +
            "OR (users.user_id = transactions.client_id AND music.item_id = transactions.item_id)" +
            "OR (users.user_id = transactions.client_id AND movies.item_id = transactions.item_id);");
        }
    }catch(err){
        console.log("Oops: Transaction_view already exists! ", err)
    }
    
    client.release();
}
