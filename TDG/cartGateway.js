// DB Connection
const pool = require('../db');

module.exports.updateItem = async function(item_id, discriminator) {
    // build the query string
    let query = "UPDATE " + discriminator + "SET " + discriminator + ".quantity = quantity +1, " + discriminator + ".loaned = loaned +1  WHERE item_id = " + item_id ;
    return query;
}

module.exports.checkLoanable = async function(item_id, discriminator) {
    // build the query string
    const client = await pool.connect();
    let query = "SELECT " + discriminator + ".quantity, " + discriminator + ".loaned " + discriminator + ".loanable, FROM "  + discriminator + "WHERE item_id = " + item_id;
    const results = { 'results': (query) ? query.rows : null};
    client.release();
    return results;
}

module.exports.getAvailable

