import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import your CSS file

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [image, setImage] = useState(null); // State for the image file
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(); // Create FormData to handle file upload
        formData.append('username', username);
        formData.append('password', password);
        formData.append('uniqueId', uniqueId);
        formData.append('image', image); // Append image file

        try {
            const response = await axios.post('http://localhost:5000/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type
                },
            });
            console.log(response.data);
            navigate('/login');
        } catch (err) {
            console.error('Error registering user:', err);
            setError('Error registering user');
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="uniqueId">Unique ID</label>
                    <input
                        type="text"
                        id="uniqueId"
                        placeholder="Unique ID"
                        value={uniqueId}
                        onChange={(e) => setUniqueId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Profile Image</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])} // Handle file input
                        // required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
};

export default Register;
