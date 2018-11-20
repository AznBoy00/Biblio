var tdg = require('../TDG/usersGateway');
const bcrypt = require('bcrypt-nodejs');
var catalog = require('../models/catalog');
var imap = require('../IMAP/identitymap');

//registers a new user to the DB
module.exports.insertNewUser = async function(newUser) {
    try {
        return await tdg.createNewUser(newUser);
    } catch (err) {
        console.error(err);
        res.send(err);
    }
};

//searches a user by email
async function findUserByEmail(email){
    try {
        return await tdg.getUserByEmail(email);
        
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};

//check if a user exists by email
module.exports.userExists = async function (email) {
    var result = await findUserByEmail(email); 
    if (result.rows.length == 1){
       return true;
    } else {
       return false;
    }
};

//check password using the bcrypt-nodejs protocol
module.exports.checkPassword = async function (email, password) {
    let user = await findUserByEmail(email);

    const results = { 'results': (await user) ? await user.rows : null};
    let hash = await results.results[0].password;
    if(bcrypt.compareSync('' + password, await hash)) {
        return true;
    } else {
        return false;
    }

};

//search for a user by email
module.exports.findUserByEmail = async function findUserByEmail(email){
    try {
        return await tdg.getUserByEmail(email);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};

//display all users
module.exports.displayAllUsers = async function() {
    try {
        return await tdg.getAllUsers();
    } catch (err) {
        console.error(err);
	}
};

//display active users
module.exports.displayActiveUsers = async function() {
    try{
        return await tdg.getActiveUsers();
    } catch (err){
        console.error(err);
    }
};

//check for user if he's an admin or not
async function checkIsAdmin(userid) {

};

//toggles the promotion and demotion to admin for a user
module.exports.toggleAdminStatus = async function(userid, is_admin) {
    try {
        return await tdg.changeAdminStatus(userid, is_admin);
    } catch (err) {
        console.error(err);
    }
};

//Check if user is active or not
module.exports.isActiveUser = async function(email) {
    try {
        let result = await tdg.isActiveUser(email);
        if(result.results[0].is_active) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

//toggles the user status
module.exports.setUserStatusActive = async function(email) {
    try {
        await tdg.setUserStatusActive(email);
    } catch (err) {
        console.error(err);
    }
}

module.exports.setUserStatusInactive = async function(email) {
    try {
        await tdg.setUserStatusInactive(email);
    } catch (err) {
        console.error(err);
    }
};

//getter for user profile information
module.exports.getUserInfo = async function(email) {
    try {
        return await tdg.getUserInfo(email);
    } catch (err) {
        console.error(err);
	}
}

//getter for a new user profile information
module.exports.getNewUserInfo = async function(email, req) {
    let newUserInfo;
    let hash;

    // let result = await this.getUserInfo(email);
    // console.log(result.results[0].password);
    try {
        if (req.body.password != '') {
            hash = bcrypt.hashSync(req.body.password);
            //console.log("NEW PW");
        } else {
            hash = bcrypt.hashSync(req.body.oldpassword);
            //console.log("OLD PW");
        }

        newUserInfo = await {
            "f_name": req.body.f_name,
            "l_name": req.body.l_name,
            "phone": req.body.phone,
            "password": await hash
        };
        return await newUserInfo;
    } catch (err) {
        console.error(err);
    }
}

// update user information to database
module.exports.updateUserInfo = async function(newUserInfo, email) {
    try {
        return await tdg.updateUserInfo(newUserInfo, email);
    } catch (err) {
        console.error(err);
    }
}

module.exports.returnItemTransaction = async function(req) {
    try {
        let item_id = req.params.item_id;
        imapItem = await imap.getTransactionMap(item_id);
        let transaction_id = imapItem.results[0].transaction_id;
        let discriminatorObj = await tdg.getDiscriminator(item_id);
        let discriminator = discriminatorObj.toLowerCase();
        await tdg.updateReturnTransaction(transaction_id, item_id, discriminator);
        imapItem.results[0].loaned -= 1; // -1 loaned on imap for return
    } catch (err) {
        console.error(err);
    }
}

module.exports.getLoanedItems = async function(req) {
    try {
        // Only users get to use this feature
        if (!req.session.is_admin) {
            let loaned = await catalog.getUserTransactionItems(req.session.email);
            req.session.loaned_items = [];
            for (var i = 0; i < loaned.items.length; i++) {
                // Check for not returned items (NULL)
                if (loaned.items[i].return_date == null)
                    req.session.loaned_items.push(loaned.items[i].item_id);
            }
        }
    } catch(err) {
        console.log(err);
    }
}
