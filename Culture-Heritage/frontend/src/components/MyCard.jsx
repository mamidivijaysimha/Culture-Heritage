import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import axios from 'axios';
import './MyCard.css';

const MyCard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const storedUserId = localStorage.getItem('uniqueId'); // Get the userId from localStorage

    if (!storedUserId) {
      alert('You should login to view your products.');
      navigate('/login'); // Redirect to login if session is not available
    } else {
      console.log(storedUserId);
      fetchProducts(storedUserId); // Fetch products if the user is logged in
    }
  }, [navigate]);

  const fetchProducts = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/user/${userId}`, {
        withCredentials: true,
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Delete product functionality
  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/products/${id}`, {
        withCredentials: true,
      });
      console.log('Product deleted:', response.data);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + error.message);
    }
  };

  // Edit product functionality
  const editProduct = (product) => {
    navigate(`/edit-product/${product._id}`, { state: { product } });
  };

  return (
    <div className="my-card-container">
      <h1>My Uploaded Products</h1>
      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products uploaded yet.</p>
        ) : (
          products.map(product => (
            <div className="product-card" key={product._id}>
              <img
                src={`http://localhost:5000/images/${product.image}`}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-type">{product.type}</p>
              <p className="product-price">Price: ₹{product.price}</p>
              <p className="product-quantity">Quantity: {product.quantity} </p>
              <button className="buy-button" onClick={() => editProduct(product)}>Edit</button>
              <button className="delete-button" onClick={() => deleteProduct(product._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCard;
