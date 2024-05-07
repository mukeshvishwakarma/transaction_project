from sqlalchemy import Column, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4

Base = declarative_base()

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(String, primary_key=True)
    senderId = Column(String)
    receiverId = Column(String)
    amount = Column(Float)
    details = Column(String)
    transactionId =Column(String)
    date = Column(Date)

    def __init__(self, senderId, receiverId, amount, details,transactionId,date):
        self.id = str(uuid4())
        self.senderId = senderId
        self.receiverId = receiverId
        self.amount = amount
        self.details = details
        self.transactionId = transactionId
        self.date = date

    def serialize(self):
        return {
            'id': self.id,
            'senderId': self.senderId,
            'receiverId': self.receiverId,
            'amount': self.amount,
            'details': self.details,
            'transactionId': self.transactionId,
            'date': self.date
        }
