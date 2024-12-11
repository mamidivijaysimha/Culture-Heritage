import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SearchStateDetails.module.css';

function SearchStateDetails() {
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const indiaDescription = `
            India, a land of timeless grandeur, stands as a beacon of unity amidst an awe-inspiring diversity. 
            With its roots deeply embedded in ancient history, India is a vibrant tapestry woven with countless cultures,
            traditions, and languages. From the snow-capped peaks of the Himalayas in the north to the sun-kissed shores of Kanyakumari in the south,
            and from the golden deserts of Rajasthan in the west to the lush green valleys of Arunachal Pradesh in the east, 
            every region narrates its unique tale of heritage and pride. Festivals like Diwali, Eid, Christmas, Bihu,
            and Navratri echo the harmonious coexistence of religions, while classical dances like Bharatanatyam, Kathak, Odissi,
            and Manipuri showcase the artistic soul of the nation. The aromatic spices of its cuisine, the colorful vibrance of its attire,
            and the warmth of its people reflect the unparalleled richness of Indian traditions. 
            Yet, what truly crowns India is its spirit of unity in diversity—a nation where over 1.4 billion people, speaking more than 1,600 dialects, 
            live as one. India is not just a country; it is an eternal symphony of harmony, resilience, and a celebration of humanity.
    `;

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setMessage('Please enter a state name.');
            return;
        }
        navigate(`/state/${searchQuery.trim().toLowerCase()}`);
    };

    return (
        <div className={styles.container}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <h2>Cultural Heritage</h2>
                </div>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search cultural landmarks, festivals..."
                        className={styles.searchInput}
                    />
                    <button onClick={handleSearch} className={styles.searchButton}>Search</button>
                </div>
                <div className={styles.navLinks}>
                    <Link to="/map" className={`${styles.navButton} ${styles.mapButton}`}>Explore Map</Link>
                    <Link to="/home" className={`${styles.navButton} ${styles.ecommerceButton}`}>E-Commerce</Link>
                    <Link to="/help" className={`${styles.navButton} ${styles.helpButton}`}>Help</Link>
                </div>

            </nav>

            {/* Main Content */}
            <div className={styles.mainContent}>
               
                <div className={styles.descriptionBox}>
                    <p className={styles.description}>{indiaDescription}</p>
                </div>
            </div>
        </div>
    );
}

export default SearchStateDetails;
