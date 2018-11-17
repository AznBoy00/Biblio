// DB Connection
const pool = require('../db');

module.exports.loan = async function(item_id, discriminator, client_id, return_date) {
    // build the query string
    let query = await 'UPDATE ' + discriminator + ' SET loaned = loaned+1 WHERE item_id = ' + item_id + '; ' +
                'INSERT INTO transactions (client_id, item_id, due_date) VALUES (' +
                client_id + ', ' +
                item_id + ', ' +
                "CURRENT_DATE + INTERVAL '" + return_date + " day 23:59:59');";
    console.log(query);
    return query;
}

module.exports.checkLoanable = async function(item_id, discriminator) {
    // build the query string
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM ' + discriminator + ' WHERE item_id = ' + item_id + ';');
        const results = { 'results': (result) ? result.rows : null};
        client.release();
        return results;
    } catch (err) {
        console.log(err);
    }
}

module.exports.getAvailable

