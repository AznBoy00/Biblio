// DB Connection
const pool = require('../db');

module.exports.updateItem = async function(item_id, discriminator) {
    // build the query string
    let query = "UPDATE " + discriminator + "SET " + discriminator + ".quantity = quantity +1, " + discriminator + ".loaned = loaned +1  WHERE item_id = " + item_id ;
    return query;
}

module.exports.checkLoanable = async function(item_id, discriminator) {
    // build the query string
    try {
        const client = await pool.connect();
        let result = "SELECT * FROM "  + discriminator + " WHERE item_id = " + item_id + ";";
        const results = { 'results': (result) ? result.rows : null};
        console.log("CHECK LOANABLE: " + JSON.stringify(results));
        client.release();
        return results;
    } catch (err) {
        console.log(err);
    }
}

module.exports.getAvailable

