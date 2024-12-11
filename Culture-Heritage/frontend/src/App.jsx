import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Upload from './components/Upload';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import MyCard from './components/MyCard';
import EditProduct from './components/EditProduct'; 
import Handicrafts from './components/Handicrafts';
import Spcies from './components/Spcies';
import Jewelry from './components/Jewelry';
import Textiles from './components/Textiles';
import Logout from './components/Logout';
import Buy from './components/Buy';
import Buy2 from './components/Buy2'; // Import Buy component
import Profile from './components/Profile'; // Import Profile componenttor
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UploadStateDetails from './components/UploadStateDetails';
import SearchStateDetails from './components/SearchStateDetails';
import DisplayComponent from './components/DisplayComponent';
import FestivalsPage from './components/FestivalsPage';
import Food from './components/Food';
import ArtsAndCrafts from './components/ArtsAndCrafts';
import History from './components/History';
import TouristPlaces from './components/TouristPlaces';
import MapComponent from './components/MapComponent';
import ChatbotPage from './ChatbotPage';
import Payment from './components/Payment';
import './App.css'; 

const App = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Router>
      <Content 
        cartItems={cartItems} 
        setCartItems={setCartItems} 
      />
    </Router>
  );
};
const Content = ({ cartItems, setCartItems }) => {
  const location = useLocation();

  // Check if the current path is "/home" or matches the DisplayComponent path
  const shouldShowMapButton = 
  location.pathname === '/home' || 
  /^\/state\/[^/]+$/.test(location.pathname) || 
  location.pathname === '/map';


  // Check if the "Go to Home" button should be shown
  const shouldShowHomeButton = ['/cart', '/mycard', '/profile','/upload'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/home" element={<Home cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mycard" element={<MyCard />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/vegetables" element={<Handicrafts cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/hardware" element={<Spcies cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/fertilizers" element={<Jewelry cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/crops" element={<Textiles cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/buy/:productId" element={<Buy />} />
        <Route path="/buy2/:productId" element={<Buy2 />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/uploads" element={<UploadStateDetails />} />
        <Route path="/" element={<SearchStateDetails />} />
        <Route path="/state/:stateName" element={<DisplayComponent />} />
        <Route path="/state/:stateName/festivals" element={<FestivalsPage />} />
        <Route path="/state/:stateName/food" element={<Food />} />
        <Route path="/state/:stateName/arts-and-crafts" element={<ArtsAndCrafts />} />
        <Route path="/state/:stateName/history" element={<History />} />
        <Route path="/state/:stateName/tourist-places" element={<TouristPlaces />} />
        <Route path="/map" element={<MapComponent />} />
        <Route path="/help" element={<ChatbotPage />} />
        <Route path="/pay" element={<Payment />} />
      </Routes>

      {shouldShowHomeButton && (
        <Link to="/home" className="home-button">
          Go to Main
        </Link>
      )}


      {shouldShowMapButton && (
        <div className="bottom-button-container">
          <Link to="/" className="bottom-button">
            Go to Home
          </Link>
        </div>
      )}
    </>
  );
};


export default App;
