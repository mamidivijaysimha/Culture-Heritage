import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies if necessary
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Logout failed');
        }
        return response.text(); // Use .text() for plain text response
      })
      .then((message) => {
        console.log(message); // e.g., "Logged out successfully"
        localStorage.clear(); // Clear local storage
        sessionStorage.clear(); // Clear session storage
        navigate('/login');
      })
      .catch(err => console.error('Logout failed', err));
  }, [navigate]);
  
  

  return (
    <div className="logout-message">
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
