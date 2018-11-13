// DB connection
var connString = process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({
  	connectionString: connString,
  	ssl: true
});
pool.connect(function(err) {
    if (err) {
        console.log("------------------------------------------------");
        console.log("Can not connect to the DB");
        console.log("Check the GitHub repo for instruction on how to connect");
        console.log("https://github.com/AznBoy00/soen343team5");
        console.log("------------------------------------------------");
        console.log(err);
    }
});
module.exports = pool;