import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Import your styles

const Textiles = ({ setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Hook to access the navigate function

  useEffect(() => {
    const fetchVegetables = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/type/textiles');
        setProducts(response.data);
      } catch (error) {
        console.error('Error in fetching the products:', error);
      }
    };
    fetchVegetables();
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
      navigate('/cart'); // Redirect to cart after adding an item
    } catch (error) {
      console.error('Error adding to cart:', error.response.data); // Log error response
      alert('You should login to add products to your cart');
    }
  };

  // Filter products based on the search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <li><Link to="/mycard">My Card</Link></li>
          </ul>
        </nav>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="welcome-message">
        <h2>Textiles</h2>
        <p>Weaving Tradition into Every Thread: Explore Authentic Indian Textiles!</p>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div className="product-card" key={product._id}>
              <img
                src={`http://localhost:5000/images/${product.image}`}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-type">{product.type}</p>
              <p className="product-price">Price: ₹{product.price}</p>
              <p className="product-quantity">Available Quantity: {product.quantity} </p>
              <div className="button-container">
                <button className="buy-button" onClick={() => addToCart(product)}>Add to Cart</button>
                <Link to={`/buy/${product._id}`} className="buy-link-button">
                  Buy
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No products are available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Textiles;
