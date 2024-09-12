import React, { useState } from 'react';
import axios from 'axios';
import './AddCar.css';
import { useUser } from '../../Contexts/AuthContext';
import { apilink } from '../../App';

const CarDetailsForm = () => {
    const { userId, setUserId, name, setName, userEmail, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider, logout } = useUser()
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
            const response = await axios.post(`${apilink}/car/addcar`, carData);
            alert('Your car successfully uploaded');
            
            if (!isProvider) {
                try {
                    await axios.post(`${apilink}/user/changeIsProvider`, userEmail);
                } catch (error) {
                    console.log(error);
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
        <>
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
                            <label>Price per Hour:</label>
                            <input
                                type="number"
                                name="pricePerHour"
                                value={carDetails.pricePerHour}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-row">
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
                        <div className="form-group ">
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
                    <div className="form-group custom-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="availability"
                                checked={carDetails.availability}
                                onChange={handleChange}
                            />
                            <span className="checkmark"></span>
                            <label>Available</label>
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
        </>

    );
};

export default CarDetailsForm;
