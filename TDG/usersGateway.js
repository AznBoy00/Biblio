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
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Users WHERE Users.email = \'' + email + '\'');
    client.release();
    return result;
}

//displayAllUsers Model
module.exports.getAllUsers = async function(){
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM users ORDER BY user_id ASC');
    const results = { 'results': (result) ? result.rows : null};
    client.release();
    return results;
}

//display active users
module.exports.getActiveUsers = async function(){
    let query = "SELECT * FROM Users WHERE is_active = 't'";

    const client = await pool.connect()
    const result = await client.query(query);
    client.release();

    const results = { 'results': (result) ? result.rows : null};
    return results;
}


// Set user to active
module.exports.setUserStatusActive = async function(email){
    const client = await pool.connect();
    // await client.query("UPDATE users SET is_active = '" + toggle + "' WHERE email = ($1)", [email]);
    let query = "UPDATE Users SET is_active = 't' WHERE email = '" + email+"'";
    await client.query(query);
    client.release();
}

module.exports.setUserStatusInactive = async function(email) {
    const client = await pool.connect();
    // await client.query("UPDATE users SET is_active = '" + toggle + "' WHERE email = ($1)", [email]);
    let query = "UPDATE Users SET is_active = 'f' WHERE email = '" + email+"'";
    await client.query(query);
    client.release();
}

//toggleAdminStatus Model
module.exports.changeAdminStatus = async function(userid, is_admin){
    let result;
    var toggle;
    const client = await pool.connect();
    if (is_admin == false)
        toggle = 't';
    else
        toggle = 'f';
    result = await client.query("UPDATE users SET is_admin = '" + toggle + "' WHERE user_id = ($1)", [userid]);
    client.release();
}

//getUserInfo Model
module.exports.getUserInfo = async function(email){
    const client = await pool.connect()
    let result;
    result = await client.query("SELECT * FROM Users WHERE email = ($1)", [email]);
    const results = { 'results': (result) ? result.rows : null};
    client.release();
    return results;
}

module.exports.updateReturnTransaction = async function(transaction_id, item_id, discriminator){

    const client = await pool.connect();
    let query = await client.query("UPDATE " + discriminator + " SET loaned = loaned-1 WHERE item_id = " + item_id + "; " +
         "UPDATE transactions SET return_date = CURRENT_DATE WHERE transaction_id = " + transaction_id + ";");
    client.release();
}

//updateUserInfo Model
module.exports.updateUserInfo = async function(newUserInfo, email){
    const client = await pool.connect();
        let result;

            result = await client.query(
                    "UPDATE users SET " +
                    "f_name = '"+ newUserInfo.f_name + "', " +
                    "l_name = '" + newUserInfo.l_name + "', " +
                    "phone = '" + newUserInfo.phone + "', " +
                    "password = '" + newUserInfo.password + "' " +
                    "WHERE email = ($1);", [email]
                );
        client.release();
}

module.exports.getDiscriminator = async function(item_id) {
    let query = "SELECT items.discriminator FROM items WHERE items.item_id = " + item_id;
    
    const client = await pool.connect();
    const res1 = await client.query(query);
    client.release();

    const result1 = (res1 != null) ? res1.rows : null;
    let discriminator = await result1[0].discriminator;

    return discriminator;
}

module.exports.getItemId = async function(transactions_id){
    let query = "SELECT transactions.item_id FROM transactions WHERE transactions.transaction_id = " + transactions_id;

    const client = await pool.connect();
    const res1 = await client.query(query);
    client.release();

    const result1 = (res1 != null) ? res1.rows : null;
    let item_id = await result1[0].item_id;

    return item_id;

}