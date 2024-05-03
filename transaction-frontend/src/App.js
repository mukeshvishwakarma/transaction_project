import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsEye, BsTrash } from "react-icons/bs";

// ### SUBTASK 1: View Transaction Details
const TransactionDetails = ({ transactionId, onDelete }) => {
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    // Fetch transaction details by ID
    axios
      .get(`http://localhost:4000/api/transactions/${transactionId}`)
      .then((response) => setTransaction(response.data))
      .catch((error) =>
        console.error("Error fetching transaction details:", error)
      );
  }, [transactionId]);

  const handleDelete = () => {
    // Send DELETE request to delete the transaction
    axios
      .delete(`http://localhost:4000/api/transactions/${transactionId}`)
      .then(() => {
        console.log("Transaction deleted successfully.");
        onDelete();
        window.location.reload();
      })
      .catch((error) => console.error("Error deleting transaction:", error));
  };

  return (
    <div className="container">
      {transaction ? (
        <div className="card bg-light mb-3">
          <div className="card-body">
            <h2 className="card-title text-primary">Transaction Details</h2>
            <table className="table">
              <tbody>
                <tr>
                  <th scope="row">ID:</th>
                  <td>{transaction.id}</td>
                </tr>
                <tr>
                  <th scope="row">Sender:</th>
                  <td>{transaction.senderId}</td>
                </tr>
                <tr>
                  <th scope="row">Receiver:</th>
                  <td>{transaction.receiverId}</td>
                </tr>
                <tr>
                  <th scope="row">Amount:</th>
                  <td>{transaction.amount}</td>
                </tr>
                <tr>
                  <th scope="row">TransactionId:</th>
                  <td>{transaction.transactionId}</td>
                </tr>
                <tr>
                  <th scope="row">Details:</th>
                  <td>{transaction.details}</td>
                </tr>
                <tr>
                  <th scope="row">Date:</th>
                  <td>{transaction.date}</td>
                </tr>
              </tbody>
            </table>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Transaction
            </button>
          </div>
        </div>
      ) : (
        <p>Loading transaction details...</p>
      )}
    </div>
  );
};

// ### SUBTASK 2: View All Transactions
// ### SUBTASK 3: Reverse Transaction
const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  useEffect(() => {
    // Fetch all transactions
    axios
      .get("http://localhost:4000/api/transactions")
      .then((response) => setTransactions(response.data))
      .catch((error) => console.error("Error fetching transactions:", error));
  }, []);

  // Function to handle transaction deletion
  const handleDelete = (transactionId) => {
    axios
      .delete(`http://localhost:4000/api/transactions/${transactionId}`)
      .then(() => {
        console.log("Transaction deleted successfully.");
        // After deletion, fetch updated transactions
        axios
          .get("http://localhost:4000/api/transactions")
          .then((response) => setTransactions(response.data))
          .catch((error) => console.error("Error fetching transactions:", error));
      })
      .catch((error) => console.error("Error deleting transaction:", error));
  };

  // Function to handle view details of a single transaction
  const handleViewDetails = (transactionId) => {
    setSelectedTransactionId(transactionId);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-info">All Transactions</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Sender Id</th>
            <th scope="col">Receiver Id</th>
            <th scope="col">Amount</th>
            <th scope="col">Transaction Id</th>
            <th scope="col">Details</th>
            <th scope="col">View Details</th>
            <th scope="col">Reverse Transaction</th> {/* Added column for actions */}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.senderId}</td>
              <td>{transaction.receiverId}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.transactionId}</td>
              <td>{transaction.details}</td>
              <td>
              <button
              className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
              onClick={() => handleViewDetails(transaction.id)}
            >
              <BsEye /> 
            </button>
            </td>
            <td>
            <button
              className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
              onClick={() => handleDelete(transaction.id)}
            >
              <BsTrash />
            </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Display Transaction Details */}
      {selectedTransactionId && (
        <TransactionDetails
          transactionId={selectedTransactionId}
          onDelete={() => setSelectedTransactionId(null)}
        />
      )}
    </div>
  );
};



// Subtask 3: Create New Transaction
const NewTransactionForm = () => {
  const [formData, setFormData] = useState({
    senderId: "",
    receiverId: "",
    amount: "",
    details: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/api/transactions", formData)
      .then((response) => {
        console.log("Transaction created:", response.data);
        window.location.reload();
      })
      .catch((error) => console.error("Error creating transaction:", error));
  };
  

  return (
    <div className="container mt-5">
      <h2 className="text-success">Create New Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group col-md-3">
          <label className="font-weight-bold">Sender ID:</label>
          <input
            type="text"
            name="senderId"
            value={formData.senderId}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-3">
          <label className="font-weight-bold">Receiver ID:</label>
          <input
            type="text"
            name="receiverId"
            value={formData.receiverId}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-3">
          <label className="font-weight-bold">Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-3">
          <label className="font-weight-bold">Details:</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create Transaction
        </button>
      </form>
    </div>
  );
};




const App = () => {

  return (
    <div>
      <h1 className="text-center text-warning mt-2">Transaction System</h1>
      

      {/* View All Transactions */}
      <AllTransactions />

      {/* Create New Transaction */}
      <NewTransactionForm />
    </div>
  );
};

export default App;
