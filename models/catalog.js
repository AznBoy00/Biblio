var item = require('./models/item');


// DB connection
var connString = process.env.DATABASE_URL || 'postgres://hizxyalrympljm:3f4cd73544ce42e3aade5131e9d72f3d4032b8e69ac8fc37d8b8186cf3de4a3d@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d6a0flgsl8bp0c';
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: connString,
    ssl: true
});

//list to be filled with item objects from item.js in models
var itemsList = [];

//below is an example of using the constructor of the object
// item.constructor(item_id, discriminator, properties (as an object));
