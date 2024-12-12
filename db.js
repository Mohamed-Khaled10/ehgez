const sqlite = require('sqlite3')
const db = new sqlite.Database('courts.db') 

const createUserTable = `CREATE TABLE IF NOT EXISTS USER (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL, 
email TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
phonenum TEXT UNIQUE,
ISADMIN INT)`

const createCourtsTable  = `CREATE TABLE IF NOT EXISTS COURTS(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL UNIQUE,
location TEXT NOT NULL,
price INTEGER NOT NULL,
rating INTEGER NOT NULL,
phonenum TEXT NOT NULL,
court_amenities TEXT NOT NULL)`
    
const createBookingTable  = `CREATE TABLE IF NOT EXISTS BOOKING(
id INTEGER PRIMARY KEY AUTOINCREMENT,
time INT NOT NULL,
date TEXT NOT NULL,
phonenum TEXT NOT NULL UNIQUE,
USER_ID INTEGER NOT NULL,
FOREIGN KEY (USER_ID) REFERENCES USER(ID))`

const createReviewTable = `CREATE TABLE IF NOT EXISTS REVIEWS(
id INTEGER PRIMARY KEY AUTOINCREMENT,
court_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
rating INTEGER NOT NULL,
comment TEXT,
STATUS TEXT DEFAULT 'pending'
)`

module.exports = {db,createUserTable, createCourtsTable, createBookingTable,createReviewTable}