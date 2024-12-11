import React, { useState } from 'react';
import axios from 'axios';
import styles from './UploadStateDetails.module.css'; // Import the CSS Module

function UploadStateDetails() {
    const [stateName, setStateName] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [history, setHistory] = useState(['']);
    const [artsAndCrafts, setArtsAndCrafts] = useState(['']);
    const [food, setFood] = useState(['']);
    const [festivals, setFestivals] = useState(['']);
    const [touristPlaces, setTouristPlaces] = useState(['']); // Added this field
    const [images, setImages] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async () => {
        if (!stateName || !introduction || !images) {
            setMessage('Please fill all required fields and upload images.');
            return;
        }

        const formData = new FormData();
        formData.append('stateName', stateName);
        formData.append('introduction', introduction);
        formData.append('history', JSON.stringify(history));
        formData.append('artsAndCrafts', JSON.stringify(artsAndCrafts));
        formData.append('food', JSON.stringify(food));
        formData.append('festivals', JSON.stringify(festivals));
        formData.append('touristPlaces', JSON.stringify(touristPlaces)); // Include touristPlaces in the form data
        Array.from(images).forEach((file) => formData.append('images', file));

        try {
            const response = await axios.post('http://localhost:5000/upload-state', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error uploading state details.');
        }
    };

    return (
        <div className={styles.uploadStateContainer}>
            <h1 className={styles.title}>Upload State Details</h1>

            <label className={styles.label}>State Name:</label>
            <input
                className={styles.inputField}
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="Enter state name"
            />
            <br />

            <label className={styles.label}>Introduction:</label>
            <textarea
                className={styles.textareaField}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="Enter introduction"
            />
            <br />

            {/* Dynamic Fields for Sections */}
            <SectionInput title="History" state={history} setState={setHistory} />
            <SectionInput title="Arts and Crafts" state={artsAndCrafts} setState={setArtsAndCrafts} />
            <SectionInput title="Food" state={food} setState={setFood} />
            <SectionInput title="Festivals" state={festivals} setState={setFestivals} />
            <SectionInput title="Tourist Places" state={touristPlaces} setState={setTouristPlaces} /> {/* Added this section */}

            <label className={styles.label}>Upload Images:</label>
            <input
                className={styles.fileInput}
                type="file"
                multiple
                onChange={handleFileChange}
            />
            <br />

            <button className={styles.submitButton} onClick={handleSubmit}>
                Submit
            </button>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}

function SectionInput({ title, state, setState }) {
    return (
        <div className={styles.sectionInputContainer}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            {state.map((item, index) => (
                <div className={styles.sectionInput} key={index}>
                    <textarea
                        className={styles.sectionTextarea}
                        value={item}
                        onChange={(e) => handleFieldChange(setState, state, index, e.target.value)}
                        placeholder={`Enter details about ${title.toLowerCase()}`}
                    />
                </div>
            ))}
            <button className={styles.addMoreButton} onClick={() => handleAddField(setState, state)}>
                Add More
            </button>
        </div>
    );
}

const handleAddField = (setState, state) => {
    setState([...state, '']);
};

const handleFieldChange = (setState, state, index, value) => {
    const updatedFields = [...state];
    updatedFields[index] = value;
    setState(updatedFields);
};

export default UploadStateDetails;
