import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ setCartItems }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    const newItem = {
      uniqueId: localStorage.getItem('uniqueId'), // Ensure this is set correctly
      name: product.name,
      type: product.type,
      price: product.price,
      quantity: product.quantity, // Default quantity; change if needed
      phone: product.phone || "", // Placeholder; can be fetched from user data
      address: product.address || "", // Placeholder; can be fetched from user data
      image: product.image
    };

    try {
      // Sending POST request to add item to cart
      await axios.post('http://localhost:5000/api/cart', newItem);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error.response.data); // Log error response
      alert('You should login to add products to your cart');
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <nav className="nav">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/vegetables">Handicrafts</Link></li>
            <li><Link to="/crops">Textiles</Link></li>
            <li><Link to="/fertilizers">Jewelry</Link></li>
            <li><Link to="/hardware">Spices</Link></li>
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/mycard">My Cart</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>
      </header>

      <div className="welcome-message">
        <h2>Welcome to India's Cultural Marketplace!</h2>
        <p>Explore the rich traditions, handcrafted treasures, and cultural heritage of India.</p>
      </div>
      <div className="product-grid">
        {products.map(product => (
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
            <div className="button-container">
              <button className="buy-button" onClick={() => addToCart(product)}>Add to Cart</button>
              <Link to={`/buy/${product._id}`}>
                <button className="buy-link-button">Buy</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
