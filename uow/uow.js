// Authors: Kevin Camellini, Kevin Yao and Kayne Herrmann
// Date: November 14, 2018
// Description:
// this class keeps track of all information being created, read, updated or
// deleted. Its purpose is to minimize the amount of databse calls. It limit the 
// number of open connections to only 1, for all CRUD operations!
let uowitems = [];

//Mark item as new insert
module.exports.registerNew = async function(item){ 
    try{
        item.results.newbit = true;
        //console.log(item.results[0].title);
        uowitems.push(item);
    }catch(err){
        console.error(err);
    }
}

//Mark item as modified 
module.exports.registerDirty = async function(item){ 
    try{
        item.results.dirtybit = true;
        // console.log("Dirty item: " + item.results[0].item_id);
        uowitems.push(item);
    }catch(err){
        console.error(err);
    }
}

// Mark item as unchanged
module.exports.registerClean = async function(item){ 
    try{
        item.results.cleanbit = true;
        uowitems.push(item);
    }catch(err){
        console.error(err);
    }
}

// Mark item as deleted 
module.exports.registerDeleted = async function(item){ 
    try{
        item.results.deletebit = true;
        uowitems.push(item);
    }catch(err){
        console.error(err);
    }    
}

//Register item from UoW
module.exports.commit = async function(){ 
    try{
        return uowitems;
    }catch(err){
        console.error(err);
    }    
}

//Clear the UoW
module.exports.rollback = async function(){ 
    try{
        uowitems = [];
    }catch(err){
        console.error(err);
    }    
}