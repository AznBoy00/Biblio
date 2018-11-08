var tdg = require('../TDG/usersGateway');
const bcrypt = require('bcrypt-nodejs');

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
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM Users WHERE Users.email = \'' + email + '\'');
        client.release();
        return await result;
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
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM Users WHERE Users.email = \'' + email + '\'');
        client.release();
        return await result;
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};

//display all users
module.exports.displayAllUsers = async function() {
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM users ORDER BY user_id ASC');
        const results = { 'results': (result) ? result.rows : null};
        client.release();
        return await results;
    } catch (err) {
        console.error(err);
	}
};

//check for user if he's an admin or not
async function checkIsAdmin(userid) {

};

//toggles the promotion and demotion to admin for a user
module.exports.toggleAdminStatus = async function(userid, is_admin) {
    try {
        let result;
        var toggle;
        const client = await pool.connect();
        if (is_admin == false)
            toggle = 't';
        else
            toggle = 'f';
        result = await client.query("UPDATE users SET is_admin = '" + toggle + "' WHERE user_id = ($1)", [userid]);
    } catch (err) {
        console.error(err);
    }
};
//getter for user profile information
module.exports.getUserInfo = async function(email) {
    try {
        const client = await pool.connect()
        let result;
        result = await client.query("SELECT * FROM Users WHERE email = ($1)", [email]);
        const results = { 'results': (result) ? result.rows : null};
        client.release();
        return await results;
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
    } catch (err) {
        console.error(err);
    }
}
