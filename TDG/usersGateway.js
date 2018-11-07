// DB Connection
const pool = require('../db');


//insertNewUser Model 
exports.creatNewUser = function(newUser){
    return query("INSERT INTO Users (password, phone, email, address, f_name, l_name) VALUES ('"
    + newUser.password + "','"
    + newUser.phone + "','"
    + newUser.email+ "','"
    + newUser.address + "','"
    + newUser.fname + "','"
    + newUser.lname + "')" );
},

//findUserByEmail Model 
exports.getUserByEmail = function(email){
    return query('SELECT * FROM Users WHERE Users.email = \'' + email + '\'');
},

//displayAllUsers Models
exports.getAllUsers = function(){
    return query('SELECT * FROM users ORDER BY user_id ASC');
},

//toggleAdminStatus
exports.changeAdminStatus = function(userid, is_admin){
    return query("UPDATE users SET is_admin = '" + toggle + "' WHERE user_id = ($1)", [userid]);
}
