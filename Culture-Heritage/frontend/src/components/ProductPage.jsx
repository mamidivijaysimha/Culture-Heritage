// components/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = ({ cartItems, setCartItems }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details (again, this can be from an API or MongoDB)
    fetch(`/api/products/${productId}`)
      .then(response => response.json())
      .then(data => setProduct(data));
  }, [productId]);

  const addToCart = () => {
    setCartItems([...cartItems, product]);
  };

  return (
    <div>
      {product && (
        <>
          <h1>{product.name}</h1>
          <img src={product.imageUrl} alt={product.name} />
          <p>{product.description}</p>
          <p>Price: ₹{product.price}</p>
          <button onClick={addToCart}>Add to Cart</button>
        </>
      )}
    </div>
  );
};

export default ProductPage;
