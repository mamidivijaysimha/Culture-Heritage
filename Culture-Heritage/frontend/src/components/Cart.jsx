import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for redirection
import './Cart.css'; // Importing CSS for styling

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const userUniqueId = localStorage.getItem('uniqueId'); // Get the user unique ID
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch cart items for the user
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if (userUniqueId) { // Check if uniqueId is available
                    const response = await axios.get(`http://localhost:5000/api/cart/${userUniqueId}`);
                    setCartItems(response.data || []);
                } else {
                    alert('You must be logged in to view your cart.');
                    navigate('/login'); // Redirect to login page
                }
            } catch (error) {
                console.error('Error fetching cart items:', error.response?.data || error.message);
            }
        };

        fetchCartItems();
    }, [userUniqueId, navigate]);

    // Handle removing an item from the cart
    const handleRemoveFromCart = async (itemId) => {
        if (!userUniqueId) {
            alert('You must be logged in to remove items from the cart.');
            navigate('/login'); // Redirect to login page
            return; // Exit the function if not logged in
        }

        try {
            await axios.delete(`http://localhost:5000/api/cart/${userUniqueId}/${itemId}`);
            setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId)); // Update cart state by removing the item
            console.log('Item removed from cart');
        } catch (error) {
            console.error('Error removing item from cart:', error.response?.data || error.message);
        }
    };

    return (
        <div className="cart-container">
            <h1 >Your Cart</h1>
            <div className="cart-items">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div className="cart-item" key={item._id}>
                            <img
                                src={`http://localhost:5000/images/${item.image}`} // Ensure this path is correct
                                alt={item.name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-details">
                                <h2 className="cart-item-name">{item.name}</h2>
                                <p className="cart-item-price">Price: ₹{item.price}</p>
                                <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                                <p className="cart-item-type">Type: {item.type}</p>
                                <p className="cart-item-phone">Contact: {item.phone}</p>
                                <p className="cart-item-address">Address: {item.address}</p>
                                <button
                                    className="remove-button"
                                    onClick={() => handleRemoveFromCart(item._id)}
                                >
                                    Remove
                                </button>
                                {/* Use Link for redirection to Buy2 page */}
                                <Link to={`/buy2/${item._id}`}>
                                    <button className="b-button">Buy</button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No items in the cart.</p>
                )}
            </div>
        </div>
    );
};

export default Cart;
