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
