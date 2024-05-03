const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Transaction = require('./model');
const { v4: uuidv4 } = require('uuid');
const redis = require('redis');
const client = redis.createClient();

const app = express();
app.use(cors());
app.use(express.json());


// Middleware to cache GET requests
const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    client.get(key, (err, data) => {
        if (err) throw err;
        if (data) {
            res.json(JSON.parse(data));
        } else {
            // If data not in cache, proceed to the endpoint handler
            next();
        }
    });
};

// Retrieve all transactions
app.get('/api/transactions', cacheMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        // Cache the transactions data for 1 hour
        client.setex(req.originalUrl, 3600, JSON.stringify(transactions));
        res.json(transactions);
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update cache when transactions data is changed or added
const updateTransactionCache = async () => {
    try {
        const transactions = await Transaction.findAll();
        // Update cache for /api/transactions endpoint
        client.setex('/api/transactions', 3600, JSON.stringify(transactions));
    } catch (error) {
        console.error('Error updating transactions cache:', error);
    }
};

// Retrieve a transaction by ID
app.get('/api/transactions/:transactionId', async (req, res) => {
    const transactionId = req.params.transactionId;
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        console.error('Error retrieving transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new transaction
app.post('/api/transactions', async (req, res) => {
    var { senderId, receiverId, amount, details } = req.body;

    // Validation: Check if amount is blank or not a number
    if (amount === undefined || isNaN(amount)) {
        return res.status(400).json({ error: 'Amount is required and must be a number' });
    }

    // Convert amount to number
    amount = parseFloat(amount);

    // If amount is 0 or negative, return error
    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Rest of the code
    var generateUUID = (id) => uuidv4(`${id}`);
    var transactionId = uuidv4();
    receiverId = generateUUID(senderId);
    senderId = generateUUID(receiverId);

    try {
        const newTransaction = await Transaction.create({ senderId, receiverId, amount, details, transactionId });
        await updateTransactionCache();
        
        // Simulate notification to sender
        console.log(`Notification: You have initiated a transaction with transaction ID ${transactionId}.`);
        
        // Simulate notification to receiver
        console.log(`Notification: You have received a transaction with transaction ID ${transactionId}.`);

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error updating transactions data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Delete a transaction by ID
app.delete('/api/transactions/:transactionId', async (req, res) => {
    const transactionId = req.params.transactionId;
    try {
        const result = await Transaction.destroy({ where: { id: transactionId } });
        if (!result) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
