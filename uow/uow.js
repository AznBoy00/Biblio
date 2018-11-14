// let imap = require('../IMAP/identitymap');
// -------IMAP
//Initialize map as empty.
var imap=[];
var fullCatalogLoaded = false;
// -------IMAP

// Mapper -> IMAP -> UoW -> Mapper -> TDG -> DB?
// Mapper -> UoW
//        -> IMAP
//        -> TDG
// 

//When will we be using IMAP?
//

//Purpose is limit DB call to minimum by grouping all changes done in a transaction
//When will we be using UoW?
//

// order of operations
// UDPATE
//  -> register dirty
//  -> commit -> TDG
//      ->IMAP
//  -> register clean

// CREATE
//  -> register new in UoW
//  -> Mapper calls commit, UoW returns objects inside registerNew
//      -> TDG 

// READ
// -> register clean


// DELETE
// -> register deleted 
// -> commit -> TDG 
//    ->IMAP
    

module.exports.registerNew = async function(){
    try{

    }catch(err){
        console.error(err);
    }
}

module.exports.registerDirty = async function(){
    try{

    }catch(err){
        console.error(err);
    }
}

module.exports.registerClean = async function(){
    try{

    }catch(err){
        console.error(err);
    }
}

module.exports.registerDeleted = async function(){
    try{

    }catch(err){
        console.error(err);
    }    
}

module.exports.commit = async function(){
    try{
        // TDG CALLS
    }catch(err){
        console.error(err);
    }    
}

module.exports.rollback = async function(){
    try{
        // CLEANUP
    }catch(err){
        console.error(err);
    }    
}





















// -------IMAP
// Authors: Kevin Yau and Kevin Camellini 
// Date: November 8, 2018
// Description:
// this class serves as a middle man between the model and the TDG its purpose is
// to reduce databse calls by storing viewd itms in an IMAP object. When performing
// transactions with the model it will first check if the object exists in the 
// IMAP array. If found, it will return that instead of making another databse call
// if it is not found, it will call and ask the database for that object, once
// retrieved it will store that newly retrieved object in the IMAP object.

//Check if full catalog has been loaded once.
module.exports.findFullCatalog = async function(){
    try{
        return fullCatalogLoaded;
    }catch(err){
        console.error(err);
    }
}

// This method checks to see if an item already exists in the IMAP
// If it exists it returns TRUE
// If it does not exist it returns FALSE 
module.exports.find = async function(item_id){
    try{
        let found = false;
        for(i=0; i<imap.length; i++){
            if(imap[i].results[0].item_id == item_id){
                found = true;
                return found;
            }
        }
        return found;
    }catch(err){
        console.error(err);
    }
}

// load the full catalog into the imap 
// reset the catalog to empty first since we are going to load it all into it
module.exports.loadFullCatalog = async function(catalog){
    try{
        imap = [];
        for (var i in catalog['items']){//catalog[book], catalog[magazine]...
            let results = {'results': [catalog['items'][i]]};
            this.addItemToMap(results);
        }
        fullCatalogLoaded = true;
        // this.showAllMap();
    }catch(err){
        console.error(err);
    }
}

module.exports.getFullCatalog = async function(){
    try{    
        // console.log(imap[0].results[0]);
        let temp = [];
        for(var i = 0; i < imap.length; i++){
            temp[i] = imap[i].results[0];
        }
        
        let result = [];
        result.items = temp;

        return result;
    }catch(err){
        console.error(err);
    }
}

module.exports.loadFullTransactionTable = async function(transactions){
    try{
        imap = [];
        for (var i in transactions['items']){//catalog[book], catalog[magazine]...
            let results = {'results': [transactions['items'][i]]};
            this.addItemToMap(results);
        }
        this.showAllMap();
    }catch(err){
        console.error(err);
    }
}

// if find returns true, return that item from IMAP instead of making a databse call
module.exports.get = async function(item_id){ 
    try{
        // this.showAllMap();
        for(i = 0; i < imap.length; i++){
            if((imap[i].results[0].item_id == item_id))
                return await imap[i];
        }
    }catch(err){
        console.error(err);
    }
}

// update an item in the IMAP to new updated values 
module.exports.updateItem = async function(item, item_id){
    try{
        for(i=0;i<imap.length;i++){
            // Loop through imap to find item, and update with updated info
            if((imap[i].results[0].item_id == item_id)){
                for(var j in item){ // j = attribute type
                    // if attribute value is not null
                    // replace IMAP[i] object's attribute j with value of item attribute j
                    if(item[j] != null){
                        imap[i].results[0][j] = item[j];
                    }
                }
            }
        }
    }catch(err){
        console.error(err);
    }
}

// if an item is not found, get query from the databse then store that item into the IMAP
module.exports.addItemToMap = async function(item){
    try{
        item.dirtybit = true;
        imap.push(item);
    }catch(err){
        console.error(err);
    }
}

// delete an item from the IMAP after it has been deleted the IMAP
// the model will delete it from the database model.tdg.delete()
module.exports.deleteItemFromMap = async function(item_id){
    try{
        // this.showAllMap(); //show the IMAP before
        for(i = 0; i < imap.length; i++){
            if(imap[i].results[0].item_id == item_id){
                //delete 1 element at position i
                imap.splice(i, 1);
            }
        }
        this.showAllMap(); //show the IMAP after an item has been deleted
    }catch(err){
        console.error(err);
    }
}

// iterate and print all items in the IMAP
module.exports.showAllMap = async function(){ 
    try{
        console.log("================ SHOW ALL ITEMS IN IMAP ==============");
        for(i = 0; i < imap.length; i++){
            console.log("Imap["+i+"] \n" + JSON.stringify(imap[i].results[0]));
            console.log("=======================================================");
        }
    }catch(err){
        console.error(err);
    }
}
// -------IMAP