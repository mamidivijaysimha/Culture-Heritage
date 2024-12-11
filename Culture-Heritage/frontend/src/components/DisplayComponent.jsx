import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './DisplayComponent.module.css';

const DisplayComponent = () => {
  const { stateName } = useParams();
  const [stateData, setStateData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open by default

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/state/${stateName}`);
        setStateData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [stateName]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!stateData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.displayWrapper}>
      {/* Hamburger Icon for Sidebar Toggle */}
      <div className={styles.hamburgerIcon} onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
        <ul>
          <li>
            <Link to={`/state/${stateName}/history`}>History</Link>
          </li>
          <li>
            <Link to={`/state/${stateName}/tourist-places`}>Tourist Places</Link>
          </li>
          <li>
            <Link to={`/state/${stateName}/festivals`}>Festivals</Link>
          </li>
          <li>
            <Link to={`/state/${stateName}/arts-and-crafts`}>Arts and Crafts</Link>
          </li>
          <li>
            <Link to={`/state/${stateName}/food`}>Food</Link>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.contentWithSidebar : styles.contentFullWidth
        }`}
      >
        {/* State Name Heading */}
        <h2 className={styles.heading}>{stateData.stateName}</h2>

        {/* Carousel */}
        <div className={styles.carouselContainer}>
  <Carousel>
    {Array.isArray(stateData.images) && stateData.images.length > 0 ? (
      stateData.images.map((image, imgIndex) => (
        <Carousel.Item key={imgIndex}>
          <img
            className={`${styles.carouselImage} d-block w-100`}
            src={`http://localhost:5000/${image}`}
            alt={`Image ${imgIndex}`}
          />
        </Carousel.Item>
      ))
    ) : (
      <div>No images available</div>
    )}
  </Carousel>
</div>

        {/* Introduction Section */}
        <section className={styles.section}>
          <h3 className={styles.heading}>Introduction</h3>
          <div className={styles.descriptionBox}>
            <p>{stateData.introduction}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DisplayComponent;
