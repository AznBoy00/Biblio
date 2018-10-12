//to access the routes in this class, include /catalog/{ROUTE_FROM_THIS_FILE} in your URL
var express = require('express');
var router = express.Router();

// DB connection
var connString = 'postgres://hizxyalrympljm:3f4cd73544ce42e3aade5131e9d72f3d4032b8e69ac8fc37d8b8186cf3de4a3d@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d6a0flgsl8bp0c' || process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({
  	connectionString: connString,
  	ssl: true
});

//keep the next line at the end of this script
module.exports = router;
