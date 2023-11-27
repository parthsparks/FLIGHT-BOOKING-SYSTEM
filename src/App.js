// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [passengerDetails, setPassengerDetails] = useState({
    passengerName: '',
    from: '',
    to: '',
    date: '',
    departureDate: '',
    arrivalDate: '',
    phoneNumber: '',
    email: '',
  });

  const [passengerList, setPassengerList] = useState([]);
  const [updatePhone, setUpdatePhone] = useState('');
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    // Fetch all passengers on component mount
    axios.get('http://localhost:5000/passengers')
      .then((response) => {
        setPassengerList(response.data);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassengerDetails({
      ...passengerDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const endpoint = isUpdateMode
      ? `http://localhost:5000/passengers/update/${updatePhone}`
      : 'http://localhost:5000/passengers/add';

    axios.post(endpoint, passengerDetails)
      .then(() => {
        setIsUpdateMode(false);
        setUpdatedDetails({});
        setUpdatePhone('');

        // Refresh passenger list
        axios.get('http://localhost:5000/passengers')
          .then((response) => {
            setPassengerList(response.data);
          });

        // Clear form fields
        setPassengerDetails({
          passengerName: '',
          from: '',
          to: '',
          date: '',
          departureDate: '',
          arrivalDate: '',
          phoneNumber: '',
          email: '',
        });
      })
      .catch((error) => {
        console.error("Error submitting passenger details:", error);
      });
  };

  const handleDelete = (phoneNumber) => {
    // Delete passenger by phone number
    axios.delete(`http://localhost:5000/passengers/delete/${phoneNumber}`)
      .then(() => {
        // Refresh passenger list
        axios.get('http://localhost:5000/passengers')
          .then((response) => {
            setPassengerList(response.data);
          });
      });
  };

  const handleUpdateSearch = () => {
    console.log("Searching for phone number:", updatePhone);

    // Search for passenger by phone number
    axios.get(`http://localhost:5000/passengers/${updatePhone}`)
      .then((response) => {
        setUpdatedDetails(response.data);
        setPassengerDetails(response.data); // Set the form fields with the retrieved data
        setIsUpdateMode(true);
      })
      .catch((error) => {
        console.error("Error fetching passenger details for update:", error);
        setIsUpdateMode(false);
      });
  };

  return (
    <div className="App">
      <h1>Flight Booking Management System</h1>

      {/* Flight Booking form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Passenger Name:</label>
          <input
            type="text"
            name="passengerName"
            value={passengerDetails.passengerName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>From:</label>
          <input
            type="text"
            name="from"
            value={passengerDetails.from}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>To:</label>
          <input
            type="text"
            name="to"
            value={passengerDetails.to}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="text"
            name="date"
            value={passengerDetails.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Departure Date:</label>
          <input
            type="text"
            name="departureDate"
            value={passengerDetails.departureDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Arrival Date:</label>
          <input
            type="text"
            name="arrivalDate"
            value={passengerDetails.arrivalDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={passengerDetails.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={passengerDetails.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">{isUpdateMode ? 'Update Passenger' : 'Add Passenger'}</button>
      </form>

      {/* Display Flight Booking details in a tabular format */}
      <table>
        <thead>
          <tr>
            <th>Passenger Name</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
            <th>Departure Date</th>
            <th>Arrival Date</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {passengerList.map((passenger) => (
            <tr key={passenger.phoneNumber}>
              <td>{passenger.passengerName}</td>
              <td>{passenger.from}</td>
              <td>{passenger.to}</td>
              <td>{passenger.date}</td>
              <td>{passenger.departureDate}</td>
              <td>{passenger.arrivalDate}</td>
              <td>{passenger.phoneNumber}</td>
              <td>{passenger.email}</td>
              <td>
                <button onClick={() => handleUpdateSearch(passenger.phoneNumber)}>Update</button>
                <button onClick={() => handleDelete(passenger.phoneNumber)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Passenger form */}
      {isUpdateMode && (
        <div>
          <h2>Update Passenger Details</h2>
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={updatePhone}
            onChange={(e) => setUpdatePhone(e.target.value)}
          />
          <button onClick={handleUpdateSearch}>Search</button>

          {Object.keys(updatedDetails).length > 0 && (
            <div>
              {/* Your update form fields go here */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
