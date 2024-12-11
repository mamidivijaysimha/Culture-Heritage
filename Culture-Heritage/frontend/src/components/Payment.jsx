import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import axios from 'axios';
import ReactQRCode from 'react-qr-code'; // Import the QRCode component from react-qr-code
import './Payment.css';

const Payment = () => {
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const defaultUPIId = "7569772886@axl"; // Default UPI ID
    const userUniqueId = localStorage.getItem('uniqueId'); // Access unique ID from localStorage

    useEffect(() => {
        const fetchUserName = async () => {
            if (!userUniqueId) {
                setError('Unique ID is missing. Redirecting to login...');
                setTimeout(() => navigate('/login'), 0); // Redirect to login after 2 seconds
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/user-details/${userUniqueId}`, {
                    withCredentials: true, // Send cookies to backend
                });

                if (response.data && response.data.username) {
                    setUserName(response.data.username); // Use 'username' field
                } else {
                    setError('User details not found.');
                }
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Unable to fetch user details.');
            }
        };

        fetchUserName();
    }, [userUniqueId, navigate]);

    // If there's an error, show it to the user
    if (error) {
        return <p className="error-message">{error}</p>;
    }

    // If the user name is still loading, show a loading message
    if (!userName) {
        return <p>Loading...</p>;
    }

    const upiLink = `upi://pay?pa=${defaultUPIId}&pn=${userName}&am=0.00&cu=INR`; // UPI link for QR code

    return (
        <div className="payment-container">
            <h1>Payment Page</h1>
            <p><strong>Name:</strong> {userName}</p>
            <div className="qr-code">
                <ReactQRCode value={upiLink} size={200} /> {/* Generate QR code using react-qr-code */}
            </div>
        </div>
    );
};

export default Payment;
