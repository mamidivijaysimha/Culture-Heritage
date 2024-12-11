// components/ProductCard.js
import React from 'react';

const ProductCard = ({ product, cartItems, setCartItems }) => {
  const { id, name, imageUrl, price } = product;

  const addToCart = () => {
    // Check if the product is already in the cart
    const isProductInCart = cartItems.some(item => item.id === id);

    if (!isProductInCart) {
      setCartItems([...cartItems, product]);
    } else {
      alert('This product is already in your cart!');
    }
  };

  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <div className="product-details">
        <h3>{name}</h3>
        <p>₹{price}</p>
        <button onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
