import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Buy2.css';

const Buy2 = () => {
  const { productId } = useParams();  // Get the cart item's _id from the URL
  const navigate = useNavigate(); // Initialize the navigate function
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]); // State for similar products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log('Fetching product with ID:', productId); // Log productId for debugging
        const response = await axios.get(`http://localhost:5000/api/product/${productId}`);
        const product = response.data.data;  // Extract product from 'data'
        setSelectedProduct(product);

        if (product) {
          // Fetch similar products using the type and name
          const similarResponse = await axios.get(
            `http://localhost:5000/api/products/type/${product.type}/${product.name}`
          );

          setSimilarProducts(similarResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;  // Show loading state
  }

  if (error) {
    return <div>{error}</div>;  // Display error message
  }

  if (!selectedProduct) {
    return <div>No product found</div>;  // Handle case where no product is found
  }

  // Function to handle the Confirm Order button click and just redirect to the /buy page
  const handleConfirmOrder = () => {
    navigate('/pay');  // Redirect to the buy page without passing the product ID
  };

  // Rendering the product details in a card
  return (
    <div className="b-page">
      <div className="p-details">
        <img
          src={`http://localhost:5000/images/${selectedProduct.image}`}
          alt={selectedProduct.name}
          className="p-image"
          onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }} // Fallback image
        />
        <div className="p-info">
          <h1>{selectedProduct.name}</h1>
          <p>Type: {selectedProduct.type}</p>
          <p>Price: ₹{selectedProduct.price}</p>
          <p>Quantity: {selectedProduct.kg} kg</p>
          <p>Phone: {selectedProduct.phone}</p>
          <p>Address: {selectedProduct.address}</p>
          <button onClick={handleConfirmOrder}>Confirm Order</button> {/* Button that triggers the redirection */}
        </div>
      </div>

      <h3>Similar Products</h3> {/* Heading for similar products */}
      <div className="s-products">
        {similarProducts.length > 0 ? (
          similarProducts.map((product) => (
            <div key={product._id} className="s-product">
              <img src={`http://localhost:5000/images/${product.image}`} alt={product.name} />
              <p>{product.name}</p>
              <p>Price: ₹{product.price}</p>
              <button onClick={() => navigate('/buy')}>Buy</button> {/* Buy button that redirects to the buy page */}
            </div>
          ))
        ) : (
          <p>No similar products found.</p>
        )}
      </div>
    </div>
  );
};

export default Buy2;
