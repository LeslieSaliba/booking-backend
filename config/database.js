const mysql = require('mysql2');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env; 

const connection = mysql.createPool({
   host: DB_HOST,
   user: DB_USER,
   password: DB_PASSWORD,
   database: DB_NAME,
});

connection.getConnection((err) => {
   if (err) {
      return console.error(err);
   }
   console.log('Database connected successfully!')
})

const createUsers = `CREATE TABLE IF NOT EXISTS users (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(15) NOT NULL DEFAULT 'user'
)`;
connection.promise().query(createUsers)
   .then(() => {
      console.log(`Table users has been created`);
   })
   .catch((error) => {
      console.error(`Error creating table users:`, error);
   });

const createVenues = `CREATE TABLE IF NOT EXISTS venues (
   ID INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   description VARCHAR(255) NOT NULL,
   capacity INT NOT NULL,
   image VARCHAR(255) NOT NULL,
   address VARCHAR(255) NOT NULL
    )`;
connection.promise().query(createVenues)
   .then(() => {
      console.log(`Table venues has been created`);
   })
   .catch((error) => {
      console.error(`Error creating table venues:`, error);
   });

const createEvents = `CREATE TABLE IF NOT EXISTS events (
   ID INT AUTO_INCREMENT PRIMARY KEY,
   title VARCHAR(255) NOT NULL,
   date DATE NOT NULL,
   ticketPrice INT NOT NULL,
   description VARCHAR(255) NOT NULL,
   venueID INT NOT NULL,
   FOREIGN KEY (venueID) REFERENCES venues(ID) ON DELETE CASCADE ON UPDATE CASCADE
    )`;
connection.promise().query(createEvents)
   .then(() => {
      console.log(`Table events has been created`);
   })
   .catch((error) => {
      console.error(`Error creating table events:`, error);
   });

const createReservation = `CREATE TABLE IF NOT EXISTS reservation (
   ID INT AUTO_INCREMENT PRIMARY KEY,
   eventID INT,
   userID INT,
   FOREIGN KEY (eventID) REFERENCES events(ID) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (userID) REFERENCES users(ID) ON DELETE CASCADE ON UPDATE CASCADE
    )`;
connection.promise().query(createReservation)
   .then(() => {
      console.log(`Table reservation has been created`);
   })
   .catch((error) => {
      console.error(`Error creating table reservation:`, error);
   });

module.exports = connection;