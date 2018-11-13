var tdg = require('../TDG/cartGateway');
var imap = require('../IMAP/identitymap');
var user = require('../routes/users');

// add an item to the cart
module.exports.addItemToCart = async function(req) {
    try {
        console.log("SESSION: " + JSON.stringify(req.session));
        console.log("ITEM_ID: " + JSON.stringify(req.params.item_id));
        req.session.cart.push(req.params.item_id);
    } catch (err) {
        console.error(err);
    }   
}

module.exports.deleteItemFromCart = async function(req) {
    try {
        console.log("SESSION: " + JSON.stringify(req.session));
        console.log("ITEM_ID: " + JSON.stringify(req.params.item_id));
        let sessCart = req.session.cart;
        let item = sessCart.indexOf('req.params.item_id');
        sessCart.splice(item,1);
    } catch (err) {
        console.error(err);
    }   
}

module.exports.deleteAllItemsFromCart = async function(req) {
    try {
        req.session.cart = [];
    } catch (err) {
        console.error(err);
    } 
}