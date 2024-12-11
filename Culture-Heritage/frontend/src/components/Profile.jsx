import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const uniqueId = localStorage.getItem('uniqueId');
            if (!uniqueId) {
                setError('No unique ID found');
                return;
            }
            
            try {
                console.log('Fetching user data for uniqueId:', uniqueId);
                const response = await axios.get(`http://localhost:5000/api/user/${uniqueId}`);
                console.log('User data received:', response.data);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response && error.response.status === 404) {
                    setError('User not found');
                } else {
                    setError('Error fetching user data');
                }
            }
        };
    
        fetchUserData();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    // Construct the full image URL using the stored image filename
    const imageUrl = `http://localhost:5000/images/${userData.image}`; // Update this line

    // Log the image URL to verify it is fetched
    console.log('User image URL:', imageUrl);

    return (
        <div className="profile-wrapper"> {/* Use the wrapper for centering */}
            <div className="profile-container">
                <img 
                    src={imageUrl} // Use the constructed image URL
                    alt="Profile" 
                    onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        e.target.src = 'path/to/placeholder-image.jpg'; // Placeholder image path
                    }} 
                />
                <h2>User Profile</h2>
                <p><strong>Username:</strong> {userData.username}</p>
                <p><strong>Unique ID:</strong> {userData.uniqueId}</p>
            </div>
        </div>
    );
};

export default Profile;
