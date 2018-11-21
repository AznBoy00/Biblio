/* heroku pg:psql -f dbscript.sql */
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
    num_permitted_items INTEGER DEFAULT 5,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (user_id)
);

/* ======== Items =============== */
CREATE TABLE Items(
    item_id SERIAL,
    discriminator VARCHAR(10),
    PRIMARY KEY (item_id)
);

/* ======== Transactions ======== */
CREATE TABLE Transactions(
    transaction_id SERIAL,
    client_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    loan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, /* '0000-00-00 00:00:00' */
    due_date TIMESTAMP,
    return_date TIMESTAMP,

    PRIMARY KEY (transaction_id),
    FOREIGN KEY(client_id) REFERENCES Users(user_id),
    FOREIGN KEY(item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);

/* ======== Books =============== */
CREATE TABLE Books(
    book_id SERIAL,
    item_id INT NOT NULL UNIQUE,
    discriminator VARCHAR(10) DEFAULT 'Books',
    loan_period INT DEFAULT 7,
    loanable BOOLEAN DEFAULT TRUE,
    quantity INT DEFAULT 1,
    loaned INT DEFAULT 0,
    title VARCHAR(280),
    author VARCHAR(50),
    format VARCHAR(50) DEFAULT 'Hardcover',
    pages INTEGER DEFAULT 800,
    publisher VARCHAR(50),
    language VARCHAR(50) DEFAULT 'English',
    release_date DATE, /* YYYY-MM-DD */
    isbn10 FLOAT CHECK (isbn10 between 1000000000 and 9999999999) UNIQUE NOT NULL,
    isbn13 FLOAT CHECK (isbn13 between 1000000000000 and 9999999999999) UNIQUE NOT NULL,

    PRIMARY KEY (book_id),
    FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);

/* ======== Magazines =========== */
CREATE TABLE Magazines(
    magazine_id SERIAL,
    item_id INT NOT NULL UNIQUE,
    discriminator VARCHAR(10) DEFAULT 'Magazines',
    loan_period INT DEFAULT 0,
    loanable BOOLEAN DEFAULT FALSE,
    quantity INT DEFAULT 1,
    loaned INT DEFAULT 0,
    title VARCHAR(280),
    publisher VARCHAR(50),
    language VARCHAR(50) DEFAULT 'English',
    release_date DATE, /* YYYY-MM-DD */
    isbn10 FLOAT CHECK (isbn10 between 1000000000 and 9999999999) UNIQUE NOT NULL,
    isbn13 FLOAT CHECK (isbn13 between 1000000000000 and 9999999999999) UNIQUE NOT NULL,

    PRIMARY KEY (magazine_id),
    FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);

/* ======== Movies ============== */
CREATE TABLE Movies(
    movie_id SERIAL,
    item_id INT NOT NULL UNIQUE,
    discriminator VARCHAR(10) DEFAULT 'Movies',
    loan_period INT DEFAULT 2,
    loanable BOOLEAN DEFAULT TRUE,
    quantity INT DEFAULT 1,
    loaned INT DEFAULT 0,
    title VARCHAR(280),
    director VARCHAR(50),
    producers VARCHAR(50),
    language VARCHAR(50) DEFAULT 'English',
    dubbed VARCHAR(50),
    subtitles VARCHAR(50),
    actors VARCHAR(50),
    release_date DATE, /* YYYY-MM-DD */
    run_time INT, /* in minutes (127 minutes) */

    PRIMARY KEY (movie_id),
    FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);

/* ======== Music =============== */
CREATE TABLE Music(
    music_id SERIAL,
    item_id INT NOT NULL UNIQUE,
    discriminator VARCHAR(10) DEFAULT 'Music',
    loan_period INT DEFAULT 2,
    loanable BOOLEAN DEFAULT TRUE,
    quantity INT DEFAULT 1,
    loaned INT DEFAULT 0,
    type VARCHAR(30) DEFAULT 'CD',
    title VARCHAR(280),
    artist VARCHAR(50),
    label VARCHAR(50),
    release_date DATE,
    asin CHAR(10) UNIQUE,
    PRIMARY KEY (music_id),
    FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);

/* Users */
INSERT INTO Users 
    (password, phone, email, address, f_name, l_name, num_permitted_items, is_admin)
    VALUES(
        '$2a$10$rPujXPqDTDjQWBkR4iPKrOhK0r2KJtAeoOqmMUgF/iruNsEEB18aa',
        5141234567,'admin@biblio.ca','123 Rue Guy,
         Montreal','Bob','Lennox','0',TRUE);
INSERT INTO Users 
    (password, phone, email, address, f_name, l_name, num_permitted_items, is_admin)
    VALUES(
        '$2a$10$rPujXPqDTDjQWBkR4iPKrOhK0r2KJtAeoOqmMUgF/iruNsEEB18aa',
        5141234567,'u1@biblio.ca','123 Rue Guy,
         Montreal','Momo','Taleb','5',FALSE);
INSERT INTO Users 
    (password, phone, email, address, f_name, l_name, num_permitted_items, is_admin)
    VALUES(
        '$2a$10$rPujXPqDTDjQWBkR4iPKrOhK0r2KJtAeoOqmMUgF/iruNsEEB18aa',
        5141234567,'u2@biblio.ca','123 Rue Guy,
         Montreal','C','C','5',FALSE);
INSERT INTO Users 
    (password, phone, email, address, f_name, l_name, num_permitted_items, is_admin)
    VALUES(
        '$2a$10$rPujXPqDTDjQWBkR4iPKrOhK0r2KJtAeoOqmMUgF/iruNsEEB18aa',
        5141234567,'u3@biblio.ca','123 Rue Guy,
         Montreal','Bob','Ghandi','5',FALSE);
INSERT INTO Users 
    (password, phone, email, address, f_name, l_name, num_permitted_items, is_admin)
    VALUES(
        '$2a$10$rPujXPqDTDjQWBkR4iPKrOhK0r2KJtAeoOqmMUgF/iruNsEEB18aa',
        5141234567,'u4@biblio.ca','123 Rue Guy,
         Montreal','Marcus','Aurelius','5',FALSE);

/* ======== Insert New Books ======== */
/* (book_id, item_id, title, author, publisher, quantity, isbn10, isbn13) */

INSERT INTO Items (discriminator) VALUES ('Books');
INSERT INTO Books 
    (item_id, title, author, pages, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id, 'War Dogs', 'Michael J. Fox', 801, 'Anton', 5, '2018-10-01', 1234567890, 1234567890000
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

INSERT INTO Items (discriminator) VALUES ('Books');
INSERT INTO Books 
    (item_id, title, author, pages, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id, 'Meditations', 'Marcus Aurelius', 532, 'Penguin', 6, '0181-03-15', 1234567891, 1234567891000      
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;   

INSERT INTO Items (discriminator) VALUES ('Books');
INSERT INTO Books 
    (item_id, title, author, pages, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id, 'The Selfish Gene', 'Richard Dawkins', 443, 'Penguin', 4, '2012-01-02', 1234567892, 1234567892000      
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;      

INSERT INTO Items (discriminator) VALUES ('Books');
INSERT INTO Books 
    (item_id, title, author, pages, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id, 'The Alchemist', 'Paolo Coelho', 661, 'Penguin', 2, '2010-10-10', 1234567893, 1234567893000      
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;     

INSERT INTO Items (discriminator) VALUES ('Books');
INSERT INTO Books 
    (item_id, title, author, pages, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id, 'The Golden mean', 'Annabel Lyon', 772, 'Penguin', 1, '2011-05-20', 1234567897, 1234567893007      
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;         

INSERT INTO Items (discriminator) VALUES ('Books');
INSERT INTO Books 
    (item_id, title, author, pages, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id, 'SPQR: A History of Ancient Rome', 'Mary Beard', 608, 'Liveright', 1, '2005-07-22', 1234564897, 1234564893007      
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;  

INSERT INTO Items (discriminator) VALUES ('Books');
INSERT INTO Books 
    (item_id, title, author, pages, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id, 'The Lessons of History', ' Will and Ariel Durant', 128, 'Simon & Schuster', 1, '1995-12-13', 1439149950, 9781439149959      
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;      

/* ====== Insert New Magazines ====== */
/* (magazine_id, item_id, title, publisher, quantity, isbn10, isbn13) */

INSERT INTO Items (discriminator) VALUES ('Magazines');
INSERT INTO Magazines
    (item_id, title, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id, 'BMW Magazine', 'BMW', 1, '1997-05-08', 1234567899, 1234567899000
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

INSERT INTO Items (discriminator) VALUES ('Magazines');
INSERT INTO Magazines
    (item_id, title, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id, 'Wired October', 'Wired', 2, '1998-03-03', 1234567900, 1234567900000
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    
    
INSERT INTO Items (discriminator) VALUES ('Magazines');
INSERT INTO Magazines
    (item_id, title, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id, 'Wired November', 'Wired', 3, '2003-11-11', 1234567901, 1234567901000
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;        

INSERT INTO Items (discriminator) VALUES ('Magazines');
INSERT INTO Magazines
    (item_id, title, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id,'Wired December','Wired', 6, '2006-06-15', 1234567902, 1234567902000
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;

INSERT INTO Items (discriminator) VALUES ('Magazines');
INSERT INTO Magazines
    (item_id, title, publisher, quantity, release_date, isbn10, isbn13)
    SELECT select_id,'National Geographic','Wired', 1, '2014-04-20', 1234567903, 1234567902003
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;           

/* ======== Insert New Movies ======= */
/* (movie_id, item_id, title, director, producers, dubbed, subtitles, actors, quantity, release_date, run_time) */

INSERT INTO Items (discriminator) VALUES ('Movies');
INSERT INTO Movies 
    (item_id, title, director, producers, language, dubbed, subtitles, actors, quantity, release_date, run_time)
    SELECT select_id, 'Oceans 11', 'Clint Eastwood', 'Michael Kane', 
        'English', 'English', 'German', 'George Cloney, Brad Pitt', 5, '2001-09-04', 133
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

INSERT INTO Items (discriminator) VALUES ('Movies');
INSERT INTO Movies 
    (item_id, title, director, producers, language, dubbed, subtitles, actors, quantity, release_date, run_time)
    SELECT select_id, 'Oceans 12', 'Clint Eastwood', 'Michael Kane', 
        'English', 'English', 'German', 'George Cloney, Brad Pitt', 4, '2004-09-05', 127
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    
    
INSERT INTO Items (discriminator) VALUES ('Movies');
INSERT INTO Movies 
    (item_id, title, director, producers, language, dubbed, subtitles, actors, quantity, release_date, run_time)
    SELECT select_id, 'Oceans 13', 'Clint Eastwood', 'Michael Kane', 
        'English', 'English', 'German', 'George Cloney, Brad Pitt', 10, '2005-09-05', 127
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;      

INSERT INTO Items (discriminator) VALUES ('Movies');
INSERT INTO Movies 
    (item_id, title, director, producers, language, dubbed, subtitles, actors, quantity, release_date, run_time)
    SELECT select_id, 'Oceans 14', 'Clint Eastwood', 'Michael Kane', 
        'English', 'English', 'Spanish', 'George Cloney, Brad Pitt', 9, '2006-09-05', 127
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;

INSERT INTO Items (discriminator) VALUES ('Movies');
INSERT INTO Movies 
    (item_id, title, director, producers, language, dubbed, subtitles, actors, quantity, release_date, run_time)
    SELECT select_id, '2001: A Space Odyssey', 'Stanley Kubrick', 'Stanley Kubrick', 
        'English', 'English', 'Spanish', 'Keir Dullra, Gary Lockwood', 11, '1968-09-05', 149
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;

INSERT INTO Items (discriminator) VALUES ('Movies');
INSERT INTO Movies 
    (item_id, title, director, producers, language, dubbed, subtitles, actors, quantity, release_date, run_time)
    SELECT select_id, 'Ex Machina', 'Alex Garland', 'Eli Bush', 
        'English', 'English', 'Spanish', 'Alicia Vikander, Domhnall Gleeson, Oscar Isaac', 2, '2015-02-08', 108
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;        

INSERT INTO Items (discriminator) VALUES ('Movies');
INSERT INTO Movies 
    (item_id, title, director, producers, language, dubbed, subtitles, actors, quantity, release_date, run_time)
    SELECT select_id, 'Gladiator', 'Ridley Scott', 'David Franzoni', 
        'English', 'English', 'Spanish', 'Russell Crowe, Joaquin Phoenix, Connie Nielsen', 1, '2000-02-05', 155
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;       

/* ======== Insert New Music ======== */
/* (music_id, item_id, title, artist, label, quantity, release_date, asin) */

INSERT INTO Items (discriminator) VALUES ('Music');
INSERT INTO Music
    (item_id, title, artist, label, quantity, release_date, asin)
    SELECT select_id,'Presence', 'Led Zepplin', 'Sony Production', 11, '1976-01-01', 'B008FOB124'
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

INSERT INTO Items (discriminator) VALUES ('Music');
INSERT INTO Music
    (item_id, title, artist, label, quantity, release_date, asin)
    SELECT select_id, 'The Wall', 'Pink Floyd', 'Columbia', 15, '1979-01-01', 'B008FOB125'
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    


INSERT INTO Items (discriminator) VALUES ('Music');
INSERT INTO Music
    (item_id, title, artist, label, quantity, release_date, asin)
    SELECT select_id, 'The National', 'The National', 'Brassland', 1, '2001-01-01', 'B008FOB126'
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;    

INSERT INTO Items (discriminator) VALUES ('Music');
INSERT INTO Music
    (item_id, title, artist, label, quantity, release_date, asin)
    SELECT select_id, 'For Now I Am Winter', 'Ólafur Arnalds', 'Brassland', 1, '2001-01-01', 'B008FOB127'
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;  

INSERT INTO Items (discriminator) VALUES ('Music');
INSERT INTO Music
    (item_id, title, artist, label, quantity, release_date, asin)
    SELECT select_id, 'Emotional Rescue', 'The Rolling Stones', 'The Glimmer Twins', 2, '1980-01-01', 'B008FOB128'
    FROM (SELECT CURRVAL('items_item_id_seq') select_id)q;  
    
/* ===== Insert New Transaction ===== */
/* (transaction_id, client_id, item_id, loan_date, due_date, return_date) */
INSERT INTO Transactions (client_id, item_id, loan_date, due_date, return_date);

-- TIMEZONE TO EASTERN DST
set timezone TO 'GMT+5';
