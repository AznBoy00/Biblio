// Config Variables

var session = require('express-session');
var express = require('express');
var router = express.Router();
router.use(session({
    secret : '2C44-4D44-WppQ38S',
    resave : true,
    saveUninitialized : true
}));
var expressValidator = require('express-validator');
router.use(expressValidator());
var catalog = require('../models/catalog');



// ====================================== //
// ======== Catalog Index Page ========== //
// ====================================== //
router.get('/', async (req, res) => {
    try {
        let list = await catalog.getCatalog();
        res.render('catalog/catalog', {filter: false, active: "", list: await list, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart, search: ''});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

router.get('/transactions', async (req, res) => {
    try {
        let list;
        if(req.session.is_admin) list = await catalog.getTransactionItems();
        else list = await catalog.getUserTransactionItems(req.session.email);

        res.render('transactions/transactions', {filter: false, active: "", list: await list, title: 'Transactions', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// ============================================= //
// ======== View Search Transaction Page ======= //
// ============================================= //
router.post('/searchtransactions', async (req, res) => {
    try {
        
        let list = await catalog.getSearchResultsTransactions(req);
        console.log("Search list object :", list)
        res.render('transactions/transactions', {filter: false, active: "", list: await list, title: 'TransactionSearch', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart});
    } catch (err) {
        console.error("Error Has Occured during search :" + err);
        res.render('error', { error: err });
    }
});

router.get('/filtert/:f', async (req, res) => {
    try {
        let list;
        if(req.params.f == "loan_date" || req.params.f == "due_date" || req.params.f == "return_date")
            list = await catalog.filterTransactions(req, false);
        else
            list = await catalog.filterTransactions(req, true);
        console.log(JSON.stringify(list));
        res.render('transactions/transactions', {filter: false, active: "", list: await list, title: 'TransactionSearch', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart});
    } catch (err) {
        console.error("Error Has Occured during search :" + err);
        res.render('error', { error: err });
    }
});

// ============================================== //
// ======== Get filtered catalog page ========== //
// ============================================ //

router.get('/filter/:filterType', async (req, res) => {
    try {
        let filterAndSearch;
        let filteredList;
        //filter A to Z
        if (req.params.filterType === '1' || req.params.filterType === '2' || req.params.filterType === '3' || req.params.filterType === '4' || req.params.filterType === '5') {
            let list = await catalog.getFilteredCatalog(req.params.filterType);
            filteredList = await list;
        }
        let activeList = req.query.active;
        let searched = req.query.searched;
        if (searched !== ''){
            let searchList = await catalog.getSearchResults(searched, 'true');
            filterAndSearch = getItemIdOnly(filteredList, searchList);
        }
        res.render('catalog/catalog', {filter: true, active: activeList, list: (searched !== '') ?  await filterAndSearch : await filteredList, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart, search: searched});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// ====================================== //
// ======== View Single Item Page ======= //
// ====================================== //
router.get('/view/:item_id', async (req, res) => {
    try {
        let discriminator;
        let results = await catalog.getItemById(req.params.item_id);
        discriminator = await results.results[0].discriminator;
        results.currentItemId = results.results[0].item_id;
        res.render('catalog/viewItem', { results, discriminator, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart});
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
});

// ====================================== //
// ======== View Search Items Page ======= //
// ====================================== //
router.post('/searchitems', async (req, res) => {
    try {
        let list = await catalog.getSearchResults(req.body.search, '');
        res.render('catalog/catalog', {filter: false, active: "", list: list, title: 'CatalogSearch', is_logged: req.session.logged, is_admin: req.session.is_admin, cart: req.session.cart, search: req.body.search, isSearch: true});
    } catch (err) {
        console.error("Error Has Occured during search :" + err);
        res.render('error', { error: err });
    }
});

// ====================================== //
// == GET Requests for Creating Items === //
// ====================================== //
// is_logged is passed to check the session in the front-end
// Page to select which item ti unsert. Upon selecting
// the specific item create/discriminator is rendered
router.get('/create', function (req, res) {
    if (currentUserIsAdmin(req)){
        try {
            res.render('catalog/createItems', { title: 'Create Item', is_logged: req.session.logged, is_admin: req.session.is_admin});
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// Create a new book
router.get('/create/:discriminator', function (req, res) {
    if (currentUserIsAdmin(req)){
        try {
            let discriminator = req.params.discriminator;
            res.render('catalog/createitem', { discriminator, title: 'Create Item', is_logged: req.session.logged, is_admin: req.session.is_admin});
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// ====================================== //
// == POST Requests for Creating Items === //
// ====================================== //
router.post('/create/:discriminator', async (req, res) => {
    if (currentUserIsAdmin(req)){
        try {
            await catalog.insertNewItem(req, req.params.discriminator);
            res.redirect('/catalog');
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
            }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// ====================================== //
// == GET Requests for Updating Items === //
// ====================================== //
router.get('/update/:item_id', async (req, res) => {
    if (currentUserIsAdmin(req)){
        try {
            let results = await catalog.getItemById(req.params.item_id);
            let discriminator = await results.results[0].discriminator;
            res.render('catalog/updateItem', { results, discriminator, title: 'Catalog', is_logged: req.session.logged, is_admin: req.session.is_admin});
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});


// ======================================= //
// == POST Requests for Updating Items === //
// ======================================= //
router.post('/update/:item_id', async (req, res) => {
    if (currentUserIsAdmin(req)){
        try {
            let item_id = req.params.item_id;
            await catalog.updateItem(req, item_id);
            res.redirect('/catalog/view/'+item_id);
        } catch (err) {
            console.error(err);
            res.render('error', { error: err });
        } 
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// ====================================== //
// == GET Requests for Deleting Items === //
// ====================================== //
// DELETE an ITEM from the database
router.get('/deleteitem/:item_id', async(req, res) => {
    if (currentUserIsAdmin(req)){
        try {
            await catalog.deleteItem(req.params.item_id);
            res.redirect('/catalog'); //refresh the page with the new changes
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    } else {
        res.render('index', { title: 'Home', is_logged: req.session.logged, is_admin: req.session.is_admin, errors: [{msg: "You are not an admin!"}]});
    }
});

// A route to flush the IMAP
router.get('/refreshImap', async(req, res) => {
    try {
        await catalog.flushImap(); //reset imap on logout
        res.redirect('/catalog'); //refresh the page with the new changes
    } catch (err) {
        console.error(err);
        res.send("Error " + err);        
    }
});

//keep the next line at the end of this script
module.exports = router;

let currentUserIsAdmin = function (req){
    return !!(typeof req.session.is_admin !== 'undefined' && req.session.is_admin);
};

let getItemIdOnly = function (fullList, itemIdList) {
    let filterAndSearch;
    filterAndSearch = {};
    filterAndSearch.items = [];
    var count = 0;
    for (var i = 0; i < fullList.items.length; i++){
        for(var j = 0; j < itemIdList.items.length; j++){
            if (fullList.items[i].item_id === itemIdList.items[j].item_id){
                filterAndSearch.items[count] = fullList.items[i];
                count++;
            }
        }
    }
    return filterAndSearch;
}