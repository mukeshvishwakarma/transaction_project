Prerequisites
Before you begin, ensure you have the following installed:

NPM
REDIS
MYSQL

Setup Instructions

Clone the Repository:

:-https://github.com/mukeshvishwakarma/transaction_project.git
cd project-name

Set Up Redis:Ensure Redis is installed and running on your system. You can start the Redis server using:

Steps to Run Frontend:

Navigate to the frontend directory:

cd transaction-system/frontend
Install dependencies:

npm install

Start the frontend server:

npm start
Access the frontend at http://localhost:3000.
Frontend Views:
View Transaction Details: Accessible via /transaction/:transactionId.
View All Transactions: Accessible via /transactions.
Create New Transaction: Accessible via /transactions/new.
Reverse Transaction: Accessible via /transactions/reverse/:transactionId.

Steps to Run Backend:

Navigate to the backend directory:

cd transaction-system/backend
Install dependencies:

npm install

npm run db:setup
Start the server:

npm start
API Endpoints:
GET /api/transactions/:transactionId: Retrieve a transaction by its ID.
GET /api/transactions/: Retrieve all transactions.
POST /api/transactions/: Create a new transaction.
DELETE /api/transactions/:transactionId: Reverse a transaction.


