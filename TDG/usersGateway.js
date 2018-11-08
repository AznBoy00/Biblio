// DB Connection
const pool = require('../db');


//insertNewUser Model 
module.exports.createNewUser = async function(newUser){
    const client = await pool.connect();
    const result = await client.query("INSERT INTO Users (password, phone, email, address, f_name, l_name) VALUES ('"
        + newUser.password + "','"
        + newUser.phone + "','"
        + newUser.email+ "','"
        + newUser.address + "','"
        + newUser.fname + "','"
        + newUser.lname + "')" ,function(err, result){
        if (err) {
            console.log(err);
        }
        else {
            console.log(result);
        }
    });
    client.release();

    return result;
}

//findUserByEmail Model 
module.exports.getUserByEmail = async function(email){
// NEED TO LOOK AT THIS ONE
}

//displayAllUsers Model
module.exports.getAllUsers = async function(){

}

//toggleAdminStatus Model
module.exports.changeAdminStatus = function(userid, is_admin){

}

//getUserInfo Model
module.exports.getUserInfo = function(email){

}

//updateUserInfo Model
module.exports.updateUserInfo = function(newUserInfo, email){

}
