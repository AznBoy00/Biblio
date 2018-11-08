var tdg = require('../TDG/itemsGateway');

var imap=[];//Initialize map as empty.

module.exports.find = async function(item_id,discriminator){ //Look inside map.
    try{
        let found = false;
        for(i=0; i<imap.length; i++){
            if((imap[i].item_id == item_id)&&(imap[i].discriminator==discriminator)){
                found = true;
                break;
            }
        }
        console.log("Done find in IMAP, returning : " + found);
        return await found;
    }catch(err){
        console.error(err);
    }
}

module.exports.return = async function(item_id, discriminator){ //Return item from cache
    try{
        for(i=0;i<imap.length;i++){
            console.log("Imap[i] is : " + imap[0]+" at i : " + i);
        if((imap[i].item_id == item_id) &&(imap[i].discriminator == discriminator)){
            console.log("Imap[i] is : " + imap[i]);
            // return await imap[i];
        }
    }
    }catch(err){
        console.error(err);
    }
}

module.exports.checklength = async function(){
    try{
        return imap.length;
    }catch(err){
        console.error(err);
    }
}


module.exports.createItem = async function(item){
    try{
        imap.push(item)
    }catch(err){
        console.error(err);
    }
}

module.exports.updateItem = async function(item, item_id, discrimnator){
    try{
        for(i=0;i<imap.length;i++){
            if((imap[i].item_id == item_id)&&(imap[i].discriminator==discriminator)){
                imap[i] = item;
            }
        }
    }catch(err){
        console.error(err);
    }
}


module.exports.addItemToMap = async function(item_id, discriminator){
    try{
        let temp = await tdg.getItemByID(item_id, discriminator);
        //const results = { 'results': (temp) ? temp.rows : null};
        imap.push(await tdg.getItemByID(item_id, discriminator));
        console.log(temp);
        return await temp;
    }catch(err){
        console.error(err);
    }
}