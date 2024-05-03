// model.js
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with MySQL connection parameters
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '',
    database: 'neowise',
  });
  

// Define the Transaction model
const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    receiverId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senderId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    details: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transactionId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
    
}, {
    timestamps: false // Disable timestamps
});

module.exports = Transaction;
