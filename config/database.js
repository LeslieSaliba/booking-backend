const mysql = require('mysql2');

const connection = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   connectionLimit: 10
});

// const createUsers = `CREATE TABLE IF NOT EXISTS users (
//   ID INT AUTO_INCREMENT PRIMARY KEY,
//   fullName VARCHAR(50),
//   email VARCHAR(255) UNIQUE,
//   password VARCHAR(255),
//   role VARCHAR(255)
// )`;
// connection.promise().query(createUsers)
//    .then(() => {
//       console.log(`Table users has been created`);
//    })
//    .catch((error) => {
//       console.error(`Error creating table users:`, error);
//    });

// const createVenues = `CREATE TABLE IF NOT EXISTS venues (
//    ID INT AUTO_INCREMENT PRIMARY KEY,
//    name VARCHAR(255),
//    description VARCHAR(255),
//    capacity INT,
//    image VARCHAR(255),
//    address VARCHAR(255)
//     )`;
// connection.promise().query(createVenues)
//    .then(() => {
//       console.log(`Table venues has been created`);
//    })
//    .catch((error) => {
//       console.error(`Error creating table venues:`, error);
//    });

// const createEvents = `CREATE TABLE IF NOT EXISTS events (
//    ID INT AUTO_INCREMENT PRIMARY KEY,
//    title VARCHAR(255),
//    date DATE,
//    ticketPrice INT,
//    description VARCHAR(255),
//    venueID INT,
//    FOREIGN KEY (venueID) REFERENCES venues(ID) ON DELETE CASCADE ON UPDATE CASCADE
//     )`;
// connection.promise().query(createEvents)
//    .then(() => {
//       console.log(`Table events has been created`);
//    })
//    .catch((error) => {
//       console.error(`Error creating table events:`, error);
//    });

// const createReservation = `CREATE TABLE IF NOT EXISTS reservation (
//    ID INT AUTO_INCREMENT PRIMARY KEY,
//    venueID INT,
//    userID INT,
//    FOREIGN KEY (venueID) REFERENCES venues(ID) ON DELETE CASCADE ON UPDATE CASCADE,
//    FOREIGN KEY (userID) REFERENCES users(ID) ON DELETE CASCADE ON UPDATE CASCADE
//     )`;
// connection.promise().query(createReservation)
//    .then(() => {
//       console.log(`Table reservation has been created`);
//    })
//    .catch((error) => {
//       console.error(`Error creating table reservation:`, error);
//    });

module.exports = connection;