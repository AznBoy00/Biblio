// DB Connection
const pool = require('../db');
const bcrypt = require('bcrypt-nodejs');

module.exports.insertNewUser = async function(newUser) {
    try {
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

    } catch (err) {
        console.error(err);
        res.send(err);
    }
};


async function findUserByEmail(email){
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM Users WHERE Users.email = \'' + email + '\'');
        return await result;
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};


module.exports.userExists = async function (email) {
    var result = await findUserByEmail(email);
    if (result.rows.length == 1){
       return true;
    } else {
       return false;
    }
};

module.exports.checkPassword = async function (email, password) {
    var user = await findUserByEmail(email);
    const results = { 'results': (await user) ? await user.rows : null};
    var hash = await results.results[0].password;
    if(bcrypt.compareSync('' + password, await hash)) {
        return true;
    } else {
        return false;
    }

};

module.exports.findUserByEmail = async function findUserByEmail(email){
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM Users WHERE Users.email = \'' + email + '\'');
        return await result;
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};
