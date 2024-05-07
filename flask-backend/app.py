from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model import Base, Transaction
from uuid import uuid4
from flask_cors import CORS
import redis
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Connect to MySQL database
engine = create_engine('mysql+mysqlconnector://root:@127.0.0.1/neowise')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# Connect to Redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        # Check if transactions are in Redis cache
        transactions_data = redis_client.get('transactions')
        if transactions_data:
            return jsonify(json.loads(transactions_data.decode('utf-8')))

        # Retrieve all transactions
        transactions = session.query(Transaction).all()
        serialized_transactions = [transaction.serialize() for transaction in transactions]

        # Cache transactions data in Redis for 1 hour
        redis_client.setex('transactions', 3600, json.dumps(serialized_transactions))

        return jsonify(serialized_transactions)
    except Exception as e:
        print('Error retrieving transactions:', e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/transactions/<transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    try:
        # Retrieve a transaction by ID
        transaction = session.query(Transaction).filter_by(id=transaction_id).first()
        if not transaction:
            return jsonify({'error': 'Transaction not found'}), 404

        return jsonify(transaction.serialize())
    except Exception as e:
        print('Error retrieving transaction:', e)
        return jsonify({'error': 'Internal server error'}), 500

def generate_uuid(id):
    return str(uuid4())


@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    try:
        data = request.json
        senderId = generate_uuid(data.get('senderId'))
        receiverId = generate_uuid(data.get('receiverId'))
        # senderId = str(uuid4())
        # receiverId = str(uuid4())
        transactionId = str(uuid4())
        amount = data.get('amount', 0)
        details = data.get('details', '')

        if amount <= 0:
            return jsonify({'error': 'Invalid amount. Amount must be a positive number.'}), 400
        
        new_transaction = Transaction(transactionId,senderId, receiverId, amount, details)
        session.add(new_transaction)
        session.commit()

        # Simulate notification to sender
        print(f"Notification: You have initiated a transaction with transaction ID {new_transaction.id}.")

        # Simulate notification to receiver
        print(f"Notification: You have received a transaction with transaction ID {new_transaction.id}.")

        return jsonify(new_transaction.serialize()), 201
    except Exception as e:
        return jsonify({'error': f'Error creating transaction: {e}'}), 500


@app.route('/api/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    try:
        # Delete transaction by ID
        transaction = session.query(Transaction).filter_by(id=transaction_id).first()
        if not transaction:
            return jsonify({'error': 'Transaction not found'}), 404

        session.delete(transaction)
        session.commit()
        return '', 204
    except Exception as e:
        print('Error deleting transaction:', e)
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True,port=4000)
