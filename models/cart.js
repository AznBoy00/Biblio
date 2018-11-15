// ====================================== //
// =========== Cart Model JS ============ //
// ====================================== //

// Identity Mapper
var imap = require('../IMAP/identitymap');

// ====================================== //
// ====== Get Items From Cart ======= //
// ====================================== //
module.exports.getCartCatalog = async function(req) {
    try {
        let result = [];
        // console.log("CART SIZE: " + req.session.cart.length);
        for(var i=0; i<req.session.cart.length; i++){
            // console.log("CART: " + JSON.stringify(req.session.cart));
            // console.log("CART ID at i: " + JSON.parse(req.session.cart[i]));
            result[i] = await imap.get(JSON.parse(req.session.cart[i]));
        }
        // console.log("CART Result " + JSON.stringify(result));
        return await result;
    } catch (err) {
        console.error(err);
    }
}

// ====================================== //
// ======= Add an item to the cart ====== //
// ====================================== //
module.exports.addItemToCart = async function(req) {
    try {
        // console.log("SESSION: " + JSON.stringify(req.session));
        // console.log("ITEM_ID: " + JSON.stringify(req.params.item_id));
    
        console.log("===================== BEFORE ADD to Cart :" + req.session.cart);
        req.session.cart.push(req.params.item_id);
        console.log("===================== AFTER ADD to Cart :" + req.session.cart[0].item_id);

    } catch (err) {
        console.error(err);
    }   
}

// ====================================== //
// ==== Delete selected item from cart ===//
// ====================================== //
module.exports.deleteItemFromCart = async function(req) {
    try {
        // console.log("I: " + req.params.i);
        req.session.cart.splice(req.params.i, 1);
    } catch (err) {
        console.error(err);
    }   
}
// ====================================== //
// ======= Clear the entire cart ======== //
// ====================================== //
module.exports.deleteAllItemsFromCart = async function(req) {
    try {
        req.session.cart.splice(0, JSON.parse(req.session.cart.length));
    } catch (err) {
        console.error(err);
    } 
}


// ====================================== //
// ============= UOW with CART ========== //
// ====================================== //
//Logic
// UoW should return an array of 
//items that has been viewed. Since adding to cart is just viewing 
//and not performing and update so it's not set dirty but clean.
//...
//this list of item already returned when commit is called...
// maybe use it in the Mapper (catalog.js)?
// in Mapper(Cat.js) compare the items with cleanbit == true w/ cart item_id
// if true, then run a TDG that decreases the quantity by 1?
// Copy pasting this into end of Mapper(Catalog.js).


//Start attempt to UoW Cart
//
var uow = require('../uow/uow')

module.exports.commitCarttoDB = async function (req){
    try{
        //get the items from the uow
        let result = uow.commit();

        //get the req.session.cart
        let cart = req.session.cart;
        console.log(cart);        
            //KL = Cart = initialized as empty array when first Logged in.

        //for loop 

    }catch(err){
        console.error(err);
    }
}