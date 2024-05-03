const fs = require("fs");
const mysql = require("mysql");

// MySQL connection details
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "neowise",
});
const usersData = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

const transactionsData = JSON.parse(fs.readFileSync('transactions.json', 'utf-8'));

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Insert data into users table
usersData.forEach(user => {
    const { id, name, balance } = user;
    const query = `INSERT INTO users (userid, name, balance) VALUES (?, ?, ?)`;
    connection.query(query, [id, name, balance], (err, result) => {
        if (err) {
            console.error('Error inserting data into users table:', err);
            return;
        }
        console.log(`Inserted user ${id} ${name} into users table.`);
    });
});

// Insert data into transactions table
transactionsData.forEach(transaction => {
    const { transactionId, senderId, receiverId, amount, details } = transaction;
    const query = `INSERT INTO transactions (transactionId, senderId, receiverId, amount, details) VALUES (?, ?, ?, ?, ?)`;
    connection.query(query, [transactionId, senderId, receiverId, amount, details], (err, result) => {
        if (err) {
            console.error('Error inserting data into transactions table:', err);
            return;
        }
        console.log(`Inserted transaction ${transactionId} into transactions table.`);
    });
});

// Close MySQL connection
connection.end((err) => {
    if (err) {
        console.error('Error closing MySQL connection:', err);
        return;
    }
    console.log('MySQL connection closed.');
});