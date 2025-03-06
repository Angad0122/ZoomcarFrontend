import React, { useState } from 'react';
import axios from 'axios';
import './AddCar.css';
import { useUser } from '../../Contexts/AuthContext';

const CarDetailsForm = () => {
    const { userId, userEmail, name,isProvider, setIsProvider, setCarsProvided } = useUser();
    const [carDetails, setCarDetails] = useState({
        company: '', model: '', year: '', pricePerHour: '', pricePerDay: '', city: '', address: '',
        registrationNumber: '', availability: true, carType: '', transmissionType: '', fuelType: '', seats: ''
    });
    const [images, setImages] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarDetails((prevDetails) => ({
            ...prevDetails, [name]: name === 'registrationNumber' ? value.replace(/\s/g, '') : value
        }));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 5) {
            alert('You can only upload up to 5 images.');
            return;
        }
        if (files.some(file => file.size > 10 * 1024 * 1024)) {
            alert('Each image must be 10MB or smaller.');
            setIsSubmitDisabled(true);
            return;
        }
        setIsSubmitDisabled(false);
        setImages(files);
    };

    const handleCarSubmit = async (event) => {
        event.preventDefault();
    
        // Validate Registration Number
        const registrationNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
        if (!registrationNumberRegex.test(carDetails.registrationNumber)) {
            alert('Invalid registration number format.');
            return;
        }
    
        // Get the already encrypted token from Local Storage
        const encryptedToken = localStorage.getItem('selfsteerAuthToken');
        if (!encryptedToken) {
            alert('User not authenticated');
            return;
        }
    
        // Create FormData
        const formData = new FormData();
        Object.keys(carDetails).forEach(key => formData.append(key, carDetails[key]));
        images.forEach(file => formData.append('images', file));
        formData.append('userId', userId);
        formData.append('userEmail', userEmail);
        formData.append('name', name);
    
        try {
    
            const response = await axios.post(`${import.meta.env.VITE_APILINK}/car/addcar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${encryptedToken}` // 🔥 Send the token in headers
                },
                onUploadProgress: (progressEvent) => {
                    setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                }
            });
    
            setCarsProvided(prevCars => [...prevCars, response.data.car._id]);

            // Update userData.carsProvided in localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                userData.carsProvided = [...(userData.carsProvided || []), response.data.car._id];
                localStorage.setItem('userData', JSON.stringify(userData));
            }
            alert('Car successfully uploaded');

            // Update isProvider status in the backend if necessary
            if (!isProvider) {
                const token = localStorage.getItem('selfsteerAuthToken');
                await axios.post(
                    `${import.meta.env.VITE_APILINK}/user/changeIsProvider`,
                    { email: userEmail,
                      encryptedToken :token
                    },
                    
                );
            }
            setIsProvider(true);
            // Reset form fields
            setCarDetails({ company: '', model: '', year: '', pricePerHour: '', pricePerDay: '', city: '', address: '', registrationNumber: '', availability: true, carType: '', transmissionType: '', fuelType: '', seats: '' });
            setImages([]);
            setUploadProgress(0);
        } catch (error) {
            console.error("Error adding car:", error);
            alert("Error adding car");
            setUploadProgress(0);
        }
    };
    
    
    

    
 
    return (
        <div className="form-container">
            <div className='addcarheadingdiv'>
                <h1 className='addcarheading'>Add a New Car</h1>
            </div>
            <form onSubmit={handleCarSubmit}>                
                <div className="form-group-row">
                    <div className="form-group">
                        <label>Company:</label>
                        <input
                            type="text"
                            name="company"
                            value={carDetails.company}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Model:</label>
                        <input
                            type="text"
                            name="model"
                            value={carDetails.model}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Car Type and Year in the same row */}
                <div className="form-group-row">
                    <div className="form-group">
                        <label>Year:</label>
                        <input
                            type="number"
                            name="year"
                            value={carDetails.year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Registration Number:</label>
                        <input
                            type="text"
                            name="registrationNumber"
                            value={carDetails.registrationNumber}
                            onChange={handleChange}
                            required
                            pattern="^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$"
                            title="Registration number should be in the format MP09AB0001"
                        />
                    </div>
                </div>
                <div className="form-group-row">
                    <div className="form-group">
                        <label>Car Type:</label>
                        <select
                            name="carType"
                            value={carDetails.carType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Car Type</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Pickup-Truck">Pickup-Truck</option>
                            <option value="Convertible">Convertible</option>
                            <option value="Sports">Sports</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Select Transmission type:</label>
                        <select
                            name="transmissionType"
                            value={carDetails.transmissionType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Transmission Type</option>
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Select Number of Seats:</label>
                        <select
                            name="seats"
                            value={carDetails.seats}
                            onChange={handleChange}
                            required
                        >
                            <option value=""> Select seats</option>
                            <option value="2">2</option>
                            <option value="5">5</option>
                            <option value="7">7</option>
                            <option value="10">10</option>
                            <option value="10+">10+</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Select Fuel Type:</label>
                        <select
                            name="fuelType"
                            value={carDetails.fuelType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Fuel Type</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                <div className="form-group-row">
                    
                    <div className="form-group">
                        <label>City Name:</label>
                        <input
                            type="text"
                            name="city"
                            value={carDetails.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={carDetails.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label>Price per Hour:</label>
                        <input
                            type="number"
                            name="pricePerHour"
                            value={carDetails.pricePerHour}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price per Day:</label>
                        <input
                            type="number"
                            name="pricePerDay"
                            value={carDetails.pricePerDay}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group custom-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="availability"
                            checked={carDetails.availability}
                            onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                        Available
                    </label>
                </div>

                <div className="form-group">
                    <label>Images:</label>
                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>

                {/* Progress bar overlay */}
                {uploadProgress > 0 && (
                    <div className="progress-overlay">
                        <div className="progress-container">
                            <p>Upload in progress...</p>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${uploadProgress * 2}px` }}
                                >
                                    {uploadProgress}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="button-container">
                    <button type="submit" className="submit-button" disabled={isSubmitDisabled}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CarDetailsForm;

