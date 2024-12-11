import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import styles from './TouristPlaces.module.css';

const TouristPlaces = () => {
    const { stateName } = useParams();
    const [data, setData] = useState({ images: [], places: [] });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/state/${stateName}/tourist-places`);
                setData(response.data);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err.response?.data?.message || 'Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        if (stateName) fetchData();
        else {
            setError('State name is required.');
            setLoading(false);
        }
    }, [stateName]);

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );

    if (error) return <div className="alert alert-danger text-center">Error: {error}</div>;

    return (
        <div className="container mt-4">
            <h2 className={`${styles.title} text-center mb-4`}>Tourist Places in {stateName}</h2>
            {data.images.length > 0 ? (
               <div id={`touristCarousel-${stateName}`} className={`carousel slide ${styles.carousel}`} data-bs-ride="carousel" data-bs-interval="2000">
               <div className="carousel-inner">
                   {data.images.map((image, index) => (
                       <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                           <img
                               src={`http://localhost:5000${image}`}
                               className="carouselImg"
                               alt={`Tourist place in ${stateName} - Image ${index + 1}`}
                               loading="lazy"
                           />
                       </div>
                   ))}
               </div>
               <button
                   className="carousel-control-prev"
                   type="button"
                   data-bs-target={`#touristCarousel-${stateName}`}
                   data-bs-slide="prev"
               >
                   <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                   <span className="visually-hidden">Previous</span>
               </button>
               <button
                   className="carousel-control-next"
                   type="button"
                   data-bs-target={`#touristCarousel-${stateName}`}
                   data-bs-slide="next"
               >
                   <span className="carousel-control-next-icon" aria-hidden="true"></span>
                   <span className="visually-hidden">Next</span>
               </button>
           </div>
           
            ) : (
                <div className="text-center">No tourist images available for {stateName}.</div>
            )}

            <div className="tourist-section mt-5">
                <h3 className={`${styles.subTitle} text-center mb-4`}>Famous Tourist Places in {stateName}</h3>
                {data.places.length > 0 ? (
                    <ul className="list-group">
                        {data.places.map((place, index) => (
                            <li key={index} className="list-group-item">
                                {place}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">No information available for tourist places in {stateName}.</p>
                )}
            </div>
            <div className="text-center mt-4">
                <Link to={`/state/${stateName}`} className="btn btn-primary">
                    Back to Home
                </Link>
            </div>

        </div>
    );
};

export default TouristPlaces;
