import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

const MapComponent = () => {
    useEffect(() => {
        // Initialize the map centered over India
        const map = L.map('map').setView([20.5937, 78.9629], 5);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        // Custom location icon for markers (like a location pin)
        const locationIcon = L.icon({
            iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Map_marker.svg', // URL for a location pin icon
            iconSize: [32, 48], // Size of the icon
            iconAnchor: [16, 48], // Anchor to bottom center
            popupAnchor: [0, -45] // Popup position above the icon
        });

        // Cultural landmarks
        const landmarks = [
            { name: "New Delhi", coordinates: [28.6139, 77.2090], description: "The capital city of India." },
            { name: "Mumbai", coordinates: [19.0760, 72.8777], description: "The financial capital of India." },
            { name: "Varanasi", coordinates: [25.3176, 82.9739], description: "A sacred city on the banks of the Ganges." },
            { name: "Jaipur", coordinates: [26.9124, 75.7873], description: "The Pink City, known for its rich cultural heritage." },
            { name: "Kolkata", coordinates: [22.5726, 88.3639], description: "The cultural capital of India, famous for its arts and literature." },
            { name: "Chennai", coordinates: [13.0827, 80.2707], description: "A major cultural hub in South India, known for its Dravidian-style temples." },
        ];

        // Add markers for each landmark with custom location icon
        landmarks.forEach(landmark => {
            const marker = L.marker(landmark.coordinates, { icon: locationIcon })
                .addTo(map)
                .bindPopup(`<div class="popup">
                                <b>${landmark.name}</b><br>${landmark.description}<br>
                                <a href="#" class="google-map-link" data-lat="${landmark.coordinates[0]}" data-lng="${landmark.coordinates[1]}">Open in Google Maps</a>
                            </div>`);

            // Attach event listener to the popup to redirect to Google Maps on click
            marker.on("popupopen", () => {
                const link = document.querySelector('.google-map-link');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lat = link.getAttribute('data-lat');
                    const lng = link.getAttribute('data-lng');
                    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                    window.open(googleMapsUrl, '_blank');
                });
            });
        });

        // Clean up map instance on component unmount
        return () => {
            map.remove();
        };
    }, []);

    return (
        <div>
            <h1 className="map-header">Discover India's Rich Cultural Heritage</h1>
            <p className="map-subheader">Explore the historic landmarks and cities that define India's diverse culture.</p>
            <div id="map"></div>
        </div>
    );
};

export default MapComponent;
