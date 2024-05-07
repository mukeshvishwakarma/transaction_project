import json
import mysql.connector

# MySQL connection details
connection = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="",
    database="neowise"
)

# Function to read JSON data from file
def read_json(filename):
    with open(filename, 'r') as file:
        data = json.load(file)
    return data

# Insert data into users table
def insert_users(users_data):
    cursor = connection.cursor()
    for user in users_data:
        user_id = user['id']
        name = user['name']
        balance = user['balance']
        query = "INSERT INTO users (userid, name, balance) VALUES (%s, %s, %s)"
        cursor.execute(query, (user_id, name, balance))
        print(f"Inserted user {user_id} {name} into users table.")
    connection.commit()
    cursor.close()

# Insert data into transactions table
def insert_transactions(transactions_data):
    cursor = connection.cursor()
    for transaction in transactions_data:
        transactionId = transaction['transactionId']
        senderId = transaction['senderId']
        receiverId = transaction['receiverId']
        amount = transaction['amount']
        details = transaction['details']
        query = "INSERT INTO transactions (transactionId, senderId, receiverId, amount, details) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (transactionId, senderId, receiverId, amount, details))
        print(f"Inserted transaction {transactionId} into transactions table.")
    connection.commit()
    cursor.close()

# Read users data from JSON file
users_data = read_json('users.json')

# Read transactions data from JSON file
transactions_data = read_json('transactions.json')

# Insert users data into users table
insert_users(users_data)

# Insert transactions data into transactions table
insert_transactions(transactions_data)

# Close MySQL connection
connection.close()
