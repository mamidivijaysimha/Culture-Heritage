import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import styles from './FestivalsPage.module.css';  // Ensure correct import

const FestivalsPage = () => {
    const { stateName } = useParams();
    const [data, setData] = useState({ images: [], festivals: [] });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!stateName) {
            setError('State name is required.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/state/${stateName}/images`);
                console.log('API Response:', response.data); // Debug log
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    setError(response.data.message || 'Unable to fetch data.');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
            <h2 className={`${styles.title} text-center mb-4`}>Culture of {stateName}</h2>  
            {data.images.length > 0 ? (
                <div
                id={`imagesCarousel-${stateName}`}
                className="carousel slide"
                data-bs-ride="carousel"  // Enables automatic sliding
                data-bs-interval="2000" // Sets the slide interval to 2 seconds
            >
                <div className="carousel-inner">
                    {data.images.map((image, index) => (
                        <div
                            key={index}
                            className={`carousel-item ${index === 0 ? 'active' : ''}`}
                        >
                            <img
                                src={`http://localhost:5000${image}`}
                                className="d-block w-100"
                                alt={`Festival in ${stateName} - Image ${index + 1}`}
                                loading="lazy"
                                style={{ height: '400px', objectFit: 'cover', width: '100%' }}
                            />
                        </div>
                    ))}
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target={`#imagesCarousel-${stateName}`}
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target={`#imagesCarousel-${stateName}`}
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            
            ) : (
                <div className="text-center">No images available for {stateName}.</div>
            )}

            <div className="festivals-section mt-5">
                <h3 className={`${styles.subTitle} text-center mb-4`}>Festivals of {stateName}</h3>  
                {data.festivals.length > 0 ? (
                    <ul className="list-group">
                        {data.festivals.map((festival, index) => (
                            <li key={index} className="list-group-item">
                                {festival}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">No festivals information available for {stateName}.</p>
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

export default FestivalsPage;
