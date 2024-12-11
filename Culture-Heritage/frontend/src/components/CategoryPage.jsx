// components/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard'; // A component for displaying individual products

const CategoryPage = ({ cartItems, setCartItems }) => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products based on category (you can connect to an API or MongoDB here)
    // Example: Fetch products from a JSON file or API
    fetch(`/api/products?category=${categoryName}`)
      .then(response => response.json())
      .then(data => setProducts(data));
  }, [categoryName]);

  return (
    <div>
      <h1>{categoryName} Products</h1>
      <div className="product-list">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            cartItems={cartItems} 
            setCartItems={setCartItems} 
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
