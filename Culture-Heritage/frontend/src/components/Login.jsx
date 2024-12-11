import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css'; // Import your CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      
      if (response.status === 200) {
        const uniqueId = response.data.uniqueId;
        alert(`Login successful! Your unique ID is: ${uniqueId}`);
        localStorage.setItem('uniqueId', uniqueId);
        
        // Redirect to home page after successful login
        navigate('/home'); // Adjust the path to your home page route
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data?.error || error.message);
      alert('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
        </div>
        <button className="login-button" type="submit">Login</button>
        <p>
          Don't have an account? 
          <a href="/register" className="register-link"> Register here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
