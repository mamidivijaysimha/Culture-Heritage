import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Upload.css'; // Import the CSS file

const Upload = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState(''); // Selection dropdown
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate(); // Initialize useNavigate

    const sessionId = localStorage.getItem('uniqueId'); // Fetch unique ID from local storage

    const handleUpload = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Ensure sessionId is not null and matches the uploaded uniqueId
        if (!sessionId) {
            setError('Unique ID is not available.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('image', image);
        formData.append('uniqueId', sessionId); // Send uniqueId from session storage

        try {
            const response = await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            setSuccess('Product uploaded successfully!');

            // Redirect to home page after successful upload
            setTimeout(() => {
                navigate('/home'); // Redirect to home page
            }, 0); // 2-second delay for success message display

        } catch (err) {
            console.error('Error uploading product:', err);
            setError('Error uploading product');
        }
    };

    return (
        <div className="upload-container">
            <form onSubmit={handleUpload} className="upload-form">
                <h2 className="form-title">Upload Product</h2>
                <input className="input-field" type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
                
                {/* Dropdown for selecting product type */}
                <select className="input-field" value={type} onChange={(e) => setType(e.target.value)} required>
                    <option value="">Select Product Type</option>
                    <option value="handicrafts">Handicrafts</option>
                    <option value="textiles">Textiles</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="spices">Spices</option>
                </select>

                <input className="input-field" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input className="input-field" type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                <input className="input-field" type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <input className="input-field" type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <input className="input-file" type="file" onChange={(e) => setImage(e.target.files[0])} required />
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <button type="submit" className="upload-btn">Upload Product</button>
            </form>
        </div>
    );
};

export default Upload;
