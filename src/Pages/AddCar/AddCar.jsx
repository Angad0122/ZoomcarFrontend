import React, { useState } from 'react';
import axios from 'axios';
import './AddCar.css';
import { useUser } from '../../Contexts/AuthContext';

const CarDetailsForm = () => {
    const { userEmail, isProvider, setIsProvider } = useUser();

    const [carDetails, setCarDetails] = useState({
        company: '',
        model: '',
        year: '',
        pricePerHour: '',
        pricePerDay: '',
        location: '',
        registrationNumber: '',
        availability: true,
        images: [],
        carType: '',  // Added carType to state
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const processedValue = name === 'registrationNumber' ? value.replace(/\s/g, '') : value;

        setCarDetails((prevDetails) => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : processedValue,
        }));
    };

    const handleFileChange = (event) => {
        const files = event.target.files;

        if (files.length > 5) {
            alert('You can only upload up to 5 images.');
            event.target.value = ''; // Clear the file input field to prevent further processing
            return; // Prevent further processing
        }

        const promises = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            promises.push(
                new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })
            );
        }

        Promise.all(promises)
            .then((base64Images) => {
                setCarDetails((prevDetails) => ({
                    ...prevDetails,
                    images: base64Images,
                }));
            })
            .catch((error) => {
                console.error("Error reading files", error);
            });
    };

    const handleCarSubmit = async (event) => {
        event.preventDefault();

        const registrationNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
        if (!registrationNumberRegex.test(carDetails.registrationNumber)) {
            alert('Invalid registration number format. It should be in the format MP09AB0001.');
            return;
        }

        const carData = {
            ...carDetails,
            userEmail
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_APILINK}/car/addcar`, carData);
            alert('Your car successfully uploaded');
            console.log(response.data.car);

            if (!isProvider) {
                const token = localStorage.getItem('selfsteerAuthToken'); 
                try {
                    const responseOfProviderChange = await axios.post(
                        `${import.meta.env.VITE_APILINK}/user/changeIsProvider`,
                        { email: userEmail },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    console.log('Provider status changed:', responseOfProviderChange.data);
                } catch (error) {
                    if (error.response) {
                        console.log('Server error response:', error.response.data);
                    } else {
                        console.log('Client-side error:', error.message);
                    }
                }
            }

            setCarDetails({
                company: '',
                model: '',
                year: '',
                pricePerHour: '',
                pricePerDay: '',
                location: '',
                registrationNumber: '',
                availability: true,
                images: [],
                carType: '',  // Reset carType field
            });
        } catch (error) {
            if (error.response) {
                if (error.response.data.error === 'This car already exists') {
                    alert('This car already exists');
                } else {
                    console.error('Error adding car:', error.response.data);
                }
            } else {
                console.error('Error adding car:', error);
            }
        }
    };

    return (
        <div className="form-container">
            <div className='addcarheadingdiv'>
                <h1 className='addcarheading'>Add a New Car</h1>
            </div>
            <form onSubmit={handleCarSubmit}>
                {/* Other input fields... */}
                
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
                </div>

                <div className="form-group-row">
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
                    <div className="form-group">
                        <label>Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={carDetails.location}
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

                <div className="button-container">
                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CarDetailsForm;
