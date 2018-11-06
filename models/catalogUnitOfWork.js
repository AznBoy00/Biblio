// As soon as you start doing anything that might affect the database,
// you create a Unit of Work to keep track of the changes.
//
// Every time you CRUD you tell the Unit of Work
// 
// When it is time to commit, the Unit of Work figures out everything that 
// needs to be done to alter the database as a result of your work and 
// WRITES CHANGES TO THE DATABSE
//
// NEW = create
// DIRTY = update
// CLEAN = read
// DELTED = delete
// commit
// rollback
//
// In “object registration”, registration methods are placed inside object “set” 
// methods which register the object (self) as “dirty.”

// DB Connection
const pool = require('../db');

module.exports.constructor = async function(item_id, discriminator, properties) {
    // const client = await pool.connect()
    // let result;
    // let discriminator = await this.getDiscriminator(item_id);
    // try {
    //     "title": req.body.title,
    //     "author": req.body.author,
    //     "format": req.body.format,
    //     "pages": req.body.pages,
    //     "publisher": req.body.publisher,
    //     "language": req.body.language,
    //     "isbn10": req.body.isbn10,
    //     "isbn13": req.body.isbn13,
    //     "loanable": req.body.loanable,
    //     "loan_period": req.body.loan_period
    // }
    // return {item_id: item_id, discriminator: discriminator, properties: properties}
    // } catch (err) {
    //     console.error(err);
    // }
}

module.exports.getItem = async function(){

}

module.exports.getFullCatalog = async function(){

}
