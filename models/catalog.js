// DB connection
var connString = process.env.DATABASE_URL || 'postgres://hizxyalrympljm:3f4cd73544ce42e3aade5131e9d72f3d4032b8e69ac8fc37d8b8186cf3de4a3d@ec2-54-83-27-165.compute-1.amazonaws.com:5432/d6a0flgsl8bp0c';
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: connString,
    ssl: true
});

//insert new item into db

router.post('/createItem/:item_id', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query("INSERT INTO Items (discriminator) VALUES (discriminator);

            var itemList[] = ['title', 'author', 'format', 'quantity', 'pages', 'publisher'];
        const results = { 'results': (result) ? result.rows : null};
        res.render('catalog/createItem', {results, title: 'Catalog'});
        client.release();
    } catch (err) {
        console.error(err);
        res.render('error', { error: err });
    }
    switch(discriminator){
        case "Book":
            module.exports.insertNewBook = async function(newBook) {
                try {
                    const client = await pool.connect();
                    const result = await client.query("INSERT INTO Book (title, author, format, pages, publisher, language, isbn10, isbn13, quantity) VALUES ('"
                        + newBook.title + "','"
                        + newBook.author + "','"
                        + newBook.format+ "','"
                        + newBook.pages + "','"
                        + newBook.publisher + "','"
                        + newBook.language + "','"
                        + newBook.isbn10 + "','"
                        + newBook.isbn13 + "','"
                        + newBook.quantity + "')" ,function(err, result){
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
        case "Magazine":
            module.exports.insertNewMagazine = async function(newMagazine){
                try {
                    const client = await pool.connect();
                    const result = await client.query("INSERT INTO Magazine (title, author, format, pages, publisher, language, isbn10, isbn13, quantity) VALUES ('"
                        + newMagazine.title + "','"
                        + newMagazine.author + "','"
                        + newMagazine.format+ "','"
                        + newMagazine.pages + "','"
                        + newMagazine.publisher + "','"
                        + newMagazine.language + "','"
                        + newMagazine.isbn10 + "','"
                        + newMagazine.isbn13 + "','"
                        + newMagazine.quantity + "')" ,function(err, result){
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
        case "Music":

    };
});






