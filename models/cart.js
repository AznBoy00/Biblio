// ====================================== //
// =========== Cart Model JS ============ //
// ====================================== //
// Table Data Gateway
var tdg = require('../TDG/cartGateway');
// Identity Mapper
var imap = require('../IMAP/identitymap');
// Unit of Work
var uow = require('../uow/uow');
// Database Connection
const pool = require('../db');

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
        await req.session.cart.push(req.params.item_id);
        let cartItem = await imap.get(req.params.item_id);
        await uow.registerDirty(cartItem);
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
        // console.log(req.params.i);
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
// ======= Check the cart if items are checkoutable ======== //
// ====================================== //
module.exports.checkCart = async function(req) {
    let errorString = "";
    let item, quantity, loaned,loanable, discriminator, imapItem;
    try {
        for (let i = 0; i < req.session.cart.length; i++) {
            imapItem = await (imap.get(JSON.parse(req.session.cart[i])));
            discriminator = imapItem.results[0].discriminator;
            item = await tdg.checkLoanable(JSON.parse(req.session.cart[i]), discriminator);
            //console.log("ITEM: " + JSON.stringify(item));
            quantity = item.results[0].quantity;
            loaned = item.results[0].loaned;
            loanable = item.results[0].loanable;
            //console.log("ITEM: " + quantity + ", " + loaned + ", " + loanable);
            //Magazines are not loanable by default || quantity - loaned = available copies || loanable boolean
            if (discriminator == 'Magazines' || quantity == loaned || loanable == false)
            errorString += (await imap.get(JSON.parse(req.session.cart[i]))).results[0].title + " cannot be loaned. \n";
        }
        console.error("errorString for CART: \n" + errorString);
        return errorString;
    } catch (err) {
        console.error(err);
    } 
}

// ====================================== //
// ======= Loan Item ======== //
// ====================================== //
module.exports.loanItem = async function(item_id, discriminator) {
    try {
        if(quantity > loaned && loanable == true && discriminator !== "Magasines" ){
        result = cartGateway.updateItem(item_id, discriminator);
        } else {
                   
        }
    } catch (err) {
        console.error(err);
    }
    
    return result;
}


// ====================================== //
// ============= UOW with CART ========== //
// Authors: Kayne, KC, KY
// Date: November 15, 2018
// Descritpion: 
// UoW applied to the cart limits the DB calls when pressing checkout to  
// only one call and updating the quantity and loaned attribute to true.
// Each item added to the cart is set to dirty, and the whole UoW will be 
// compared to the cart's content to see if it exists inside the cart as 
// well, before commiting the loan to the DB through the TDG.
// ====================================== //

module.exports.checkoutCart = async function (req){
    try{
        //get the items from the uow
        let uowArray = await uow.commit();

        //get cart from the request
        //Kevin Link said cart is initialized as empty array when logging in
        let cart = await req.session.cart;
        // console.log(cart);        

        // DB Connection
        const client = await pool.connect();
        console.log("-------------------------------------------------");
        for(i in cart){
            for(j in uowArray){
                // if the dirty bit is set to true AND same item_id exist in cart, 
                // call the DB and update that item to loaned_out = true
                if(uowArray[j].results.dirtybit == true && uowArray[j].results[0].item_id == cart[i]){
                    // loanableitem contains the full item (item_id, title, author, pages... etc)
                    let loanableitem = uowArray[j].results[0];                                        
                    console.log("This item has been checkedout: " + loanableitem.title);
                    // let updatequery = tdg.checkoutCart(loanableitem);
                    // client.query(updatequery);
                }
            }
        }
        console.log("-------------------------------------------------");
        // close DB connection
        client.release();

        //Reset the cart upon checkout.
        this.deleteAllItemsFromCart(req);

        // Clean the cart after checkout
        await uow.rollback();
        //for loop

    }catch(err){
        console.error(err);
    }
}

