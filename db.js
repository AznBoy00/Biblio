// DB connection
var connString = process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({
  	connectionString: connString,
  	ssl: true
});
pool.connect(function(err) {
    if (err) throw err;
});
// pool.end()
module.exports = pool;