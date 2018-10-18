/* heroku pg:psql -f dbscript.sql*/
/* ======== Re-Initialize ======== */
DROP TABLE Transactions CASCADE;
DROP TABLE Users;  
DROP TABLE Items CASCADE;
DROP TABLE Books;  
DROP TABLE Magazines;  
DROP TABLE Movies;  
DROP TABLE Music; 
/* SELECT pg_sleep(1); */

/* ======== Users =============== */
CREATE TABLE Users(
    user_id SERIAL,
    password VARCHAR(200) NOT NULL,
    phone FLOAT NOT NULL,
    email VARCHAR(75) UNIQUE NOT NULL,
    address VARCHAR(50),
    f_name VARCHAR(50),
    l_name VARCHAR(50),
    num_permitted_items INTEGER DEFAULT 0,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (user_id)
);
/* SELECT pg_sleep(1); */

/* ======== Items =============== */
CREATE TABLE Items(
    item_id SERIAL,
    discriminator VARCHAR(10),
    PRIMARY KEY (item_id)
);
/* SELECT pg_sleep(1); */

/* ======== Transactions ======== */
CREATE TABLE Transactions(
    transaction_id SERIAL,
    client_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL UNIQUE,
    loan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, /* '0000-00-00 00:00:00' */
    due_date TIMESTAMP,
    return_date TIMESTAMP,

    PRIMARY KEY (transaction_id),
    FOREIGN KEY(client_id) REFERENCES Users(user_id),
    FOREIGN KEY(item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);
/* SELECT pg_sleep(1); */

/* ======== Books =============== */
CREATE TABLE Books(
    book_id SERIAL,
    item_id INT NOT NULL UNIQUE,
    discriminator VARCHAR(10) DEFAULT 'Book',
    quantity INTEGER DEFAULT 0,
    loand_period INT DEFAULT 7,
    loanable BOOLEAN DEFAULT TRUE,
    title VARCHAR(50),
    author VARCHAR(50),
    format VARCHAR(50),
    pages INTEGER,
    publisher VARCHAR(50),
    language VARCHAR(50),
    isbn10 FLOAT CHECK (isbn10 between 1000000000 and 9999999999),
    isbn13 FLOAT CHECK (isbn13 between 1000000000000 and 9999999999999),

    PRIMARY KEY (book_id),
    FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);
/* SELECT pg_sleep(1); */

/* ======== Magazines =========== */
CREATE TABLE Magazines(
    magazine_id SERIAL,
    item_id INT NOT NULL UNIQUE,
    discriminator VARCHAR(10) DEFAULT 'Magazine',
    quantity INTEGER DEFAULT 0,
    loand_period INT DEFAULT 0,
    loanable BOOLEAN DEFAULT FALSE,
    title VARCHAR(50),
    publisher VARCHAR(50),
    language VARCHAR(50),
    isbn10 FLOAT CHECK (isbn10 between 1000000000 and 9999999999),
    isbn13 FLOAT CHECK (isbn13 between 1000000000000 and 9999999999999),

    PRIMARY KEY (magazine_id),
    FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);
/* SELECT pg_sleep(1); */

/* ======== Movies ============== */
CREATE TABLE Movies(
    movie_id SERIAL,
    item_id INT NOT NULL UNIQUE,
    discriminator VARCHAR(10) DEFAULT 'Movie',
    quantity INTEGER DEFAULT 0,
    loand_period INT DEFAULT 2,
    loanable BOOLEAN DEFAULT TRUE,   
    title VARCHAR(50),
    director VARCHAR(50),
    producers VARCHAR(50),
    language VARCHAR(50),
    dubbed VARCHAR(50),
    subtitles VARCHAR(50),
    actors VARCHAR(50),
    release_date DATE, /* YYYY-MM-DD */
    run_time INT, /* in minutes (127 minutes) */

    PRIMARY KEY (movie_id),
    FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);
/* SELECT pg_sleep(1); */

/* ======== Music =============== */
CREATE TABLE Music(
    music_id SERIAL,
    item_id INT NOT NULL UNIQUE,
    discriminator VARCHAR(10) DEFAULT 'Music',
    quantity INTEGER DEFAULT 0,
    loand_period INT DEFAULT 2,
    loanable BOOLEAN DEFAULT TRUE,
    title VARCHAR(50),
    artist VARCHAR(50),
    label VARCHAR(50),
    release_date DATE,
    asin CHAR(10),
    PRIMARY KEY (music_id),
    FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);
/* SELECT pg_sleep(1); */

/* Users */
INSERT INTO Users (password, phone, email, address, f_name, l_name, num_permitted_items, is_admin)
    VALUES('a',5141234567,'admin@biblio.ca','123 Rue Guy, Montreal','Bob','Lennox','999',TRUE);
INSERT INTO Users (password, phone, email, address, f_name, l_name, num_permitted_items, is_admin)
    VALUES('a',5141234567,'u1@biblio.ca','123 Rue Guy, Montreal','Momo','Taleb','5',FALSE);
INSERT INTO Users (password, phone, email, address, f_name, l_name, num_permitted_items, is_admin)
    VALUES('a',5141234567,'u2@biblio.ca','123 Rue Guy, Montreal','C','C','5',FALSE);
INSERT INTO Users (password, phone, email, address, f_name, l_name, num_permitted_items, is_admin)
    VALUES('a',5141234567,'u3@biblio.ca','123 Rue Guy, Montreal','Bob','Ghandi','5',FALSE);
INSERT INTO Users (password, phone, email, address, f_name, l_name, num_permitted_items, is_admin)
    VALUES('a',5141234567,'u4@biblio.ca','123 Rue Guy, Montreal','Marcus','Aurelius','5',FALSE);
/* SELECT pg_sleep(1); */

/* ======== Insert New Books ======== */
/* (book_id, item_id, discriminator, quantity, loand_period, loanable, title, author, format, pages, publisher, language, isbn10, isbn13) */

INSERT INTO Items (discriminator) VALUES ('Book');
INSERT INTO Books 
    (item_id, discriminator, quantity, loand_period, loanable, title, author, format, pages, publisher, language, isbn10, isbn13)
    SELECT select_id,'Book',2,7,TRUE,'War Dogs','Michael J. Fox','Hardcopy',504,'Anton', 'English', 1234567890, 1234567890000
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    
/* SELECT pg_sleep(1); */

INSERT INTO Items (discriminator) VALUES ('Book');
INSERT INTO Books 
    (item_id, discriminator, quantity, loand_period, loanable, title, author, format, pages, publisher, language, isbn10, isbn13)
    SELECT select_id,'Book',3,7,TRUE,'Meditations','Marcus Aurelius','Hardcopy',800,'Penguin', 'English', 1234567891, 1234567891000      
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

/* SELECT pg_sleep(1); */

/* ====== Insert New Magazines ====== */
/* (magazine_id, item_id, discriminator, quantity, loand_period, loanable, title, publisher, language, isbn10, isbn13) */

INSERT INTO Items (discriminator) VALUES ('Magazine');
INSERT INTO Magazines
    (item_id, discriminator, quantity, loand_period, loanable, title, publisher, language, isbn10, isbn13)
    SELECT select_id,'Magazine',2,0,FALSE,'BMW Magazine','BMW', 'English', 1234567899, 1234567899000
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    
/* SELECT pg_sleep(1); */

INSERT INTO Items (discriminator) VALUES ('Magazine');
INSERT INTO Magazines
    (item_id, discriminator, quantity, loand_period, loanable, title, publisher, language, isbn10, isbn13)
    SELECT select_id,'Magazine',1,0,FALSE,'Wired October','Wired', 'English', 1234567900, 1234567900000
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

/* SELECT pg_sleep(1); */

/* ======== Insert New Movies ======= */
/* (movie_id, item_id, discriminator, quantity, loand_period, loanable, title, director, producers, language, dubbed, subtitles, actors, release_date, run_time) */
INSERT INTO Items (discriminator) VALUES ('Movie');
INSERT INTO Movies 
    (item_id, discriminator, quantity, loand_period, loanable, title, director, producers, language, dubbed, subtitles, actors, release_date, run_time)
    SELECT select_id, 'Movie',3,2,TRUE,'Oceans 11','Clint Eastwood', 'Michael Kane', 'English', 'English', 'German', 'George Cloney, Brad Pitt', '2001-09-04', 133
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

INSERT INTO Items (discriminator) VALUES ('Movie');
INSERT INTO Movies 
    (item_id, discriminator, quantity, loand_period, loanable, title, director, producers, language, dubbed, subtitles, actors, release_date, run_time)
    SELECT select_id, 'Movie',3,2,TRUE,'Oceans 12','Clint Eastwood', 'Michael Kane', 'English', 'English', 'German', 'George Cloney, Brad Pitt', '2004-09-05', 127
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

/* SELECT pg_sleep(1); */

/* ======== Insert New Music ======== */
/* (music_id, item_id, discriminator, quantity, loand_period, loanable, title, artist, label, release_date, asin) */
INSERT INTO Items (discriminator) VALUES ('Music');
INSERT INTO Music
    (item_id, discriminator, quantity, loand_period, loanable, title, artist, label, release_date, asin)
    SELECT select_id,'Music',5,2,TRUE,'Presence','Led Zepplin', 'Sony Production', '1976-01-01', 'B008FOB124'
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

INSERT INTO Items (discriminator) VALUES ('Music');
INSERT INTO Music 
    (item_id, discriminator, quantity, loand_period, loanable, title, artist, label, release_date, asin)
    SELECT select_id,'Music',5,2,TRUE,'The Wall','Pink Floyd', 'Columbia', '1979-01-01', 'B008FOB125'
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

/* SELECT pg_sleep(1); */

/* Transactions 1 */
INSERT INTO Transactions (client_id, item_id, loan_date, due_date, return_date)
    VALUES(2,2,CURRENT_TIMESTAMP,'2018-02-02 00:00:00','2018-03-03 00:00:00');