import React, { useState } from 'react';
import axios from 'axios';
import './AddCar.css';
import { useUser } from '../../Contexts/AuthContext';

const CarDetailsForm = () => {
    const { userId, userEmail,name, isProvider, setIsProvider, carsProvided, setCarsProvided } = useUser();
    const [carDetails, setCarDetails] = useState({
        company: '',
        model: '',
        year: '',
        pricePerHour: '',
        pricePerDay: '',
        city: '',
        address:'',
        registrationNumber: '',
        availability: true,
        images: [],
        carType: '',
        transmissionType: '',
        fuelType: '',
        seats: '',
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const processedValue = name === 'registrationNumber' ? value.replace(/\s/g, '') : value;

        setCarDetails((prevDetails) => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : processedValue,
        }));
    };

    const compressImage = async (file) => {
        //the image is getting compressed at backend not here
        return file;
    };

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);

        if (files.length > 5) {
            alert('You can only upload up to 5 images.');
            event.target.value = '';
            return;
        }

        const validFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 10 * 1024 * 1024) {
                alert('Each image must be 10MB or smaller.');
                setIsSubmitDisabled(true);
                return;
            } else {
                const compressedFile = await compressImage(file); // Compress image
                validFiles.push(compressedFile);
            }
        }
        setIsSubmitDisabled(false);

        const promises = validFiles.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

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
            userId,
            userEmail,
            name,
            encryptedToken: localStorage.getItem('selfsteerAuthToken')
        };
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_APILINK}/car/addcar`, carData, {
                onUploadProgress: (progressEvent) => {
                    const totalLength = progressEvent.total;
                    if (totalLength) {
                        setUploadProgress(Math.round((progressEvent.loaded * 100) / totalLength));
                    }
                }
            });
    
            // Extract the new car's data from the response
            const newCar = response.data.car;
    
            // Update carsProvided in the context
            setIsProvider(true);
            setCarsProvided((prevCars) => [...prevCars, newCar._id]);
    
            // Update userData.carsProvided in localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                userData.carsProvided = [...(userData.carsProvided || []), newCar._id];
                localStorage.setItem('userData', JSON.stringify(userData));
            }
    
            alert('Your car successfully uploaded');
            setUploadProgress(0);
    
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
    
            // Reset carDetails form
            setCarDetails({
                company: '',
                model: '',
                year: '',
                pricePerHour: '',
                pricePerDay: '',
                city: '',
                address: '',
                registrationNumber: '',
                availability: true,
                images: [],
                carType: '',
                transmissionType: '',
                fuelType: '',
                seats: '',
            });
        } catch (error) {
            if (error.response && error.response.status === 413) {
                alert("The size of the images is too large. Please upload smaller images.");
            } else if (error.response && error.response.status === 400) {
                alert("The car already exists!");
            } else {
                console.error("Error adding car:", error);
            }
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