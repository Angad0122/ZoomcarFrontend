import React, { useState, useEffect } from 'react';
import "./CarDetails.css";
import NavBar from '../../Components/NavBar/NavBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosStar } from "react-icons/io";
import ImageOverlay from '../../Components/ImageOverlay/ImageOverlay';
import { useUser } from '../../Contexts/AuthContext';
import axios from 'axios';

function CarDetails() {
    const { isProvider, userId, userEmail, carsProvided, setCarsProvided } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { car } = location.state || {};

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        if (car && car.ratings && car.ratings.length > 0) {
            const avg = car.ratings.reduce((sum, rating) => sum + rating, 0) / car.ratings.length;
            setAverageRating(avg.toFixed(1)); // Rounded to 1 decimal place
        }
    }, [car]);

    const handleBack = () => {
        navigate(-1);
    };

    const openOverlay = (index) => {
        setSelectedImageIndex(index);
        setOverlayVisible(true);
    };

    const closeOverlay = () => {
        setOverlayVisible(false);
    };

    const handleDelete = async () => {
        const encryptedToken = localStorage.getItem('selfsteerAuthToken') || localStorage.getItem('adminToken');

        try {
            const response = await axios.post(`${import.meta.env.VITE_APILINK}/car/deleteCar/${car._id}`, {
                encryptedToken: encryptedToken
            });

            if (response.status === 200) {
                // Update userData.carsProvided in localStorage
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData.name != import.meta.env.VITE_SELFSTEERADMINNAME) {
                    // Update carsProvided in the context
                    setCarsProvided(carsProvided.filter(id => id !== car._id));
                    userData.carsProvided = userData.carsProvided.filter(id => id !== car._id);
                    localStorage.setItem('userData', JSON.stringify(userData));
                }

                alert("Car deleted successfully");
                navigate(-1); // Redirect after successful deletion
            }
        } catch (error) {
            console.error("Error deleting the car:", error);
            alert("Failed to delete the car. Please try again.");
        }
    };


    return (
        <>
            <NavBar />
            <div className='carDetails'>
                <button onClick={handleBack} className="backButton"><FaArrowLeftLong /></button>

                <div className='carDetailsmainbox'>
                    {car ? (
                        <>
                            <div className="carImagesContainer">
                                <div className="mainImage" onClick={() => openOverlay(0)}>
                                    <img src={`${car.images[0]}`} alt="Main Car" />
                                </div>

                                <div className="thumbnailGallery">
                                    {car.images.slice(1, 5).map((image, index) => (
                                        <img
                                            key={index}
                                            src={`${image}`}
                                            alt={`Car Thumbnail ${index + 1}`}
                                            className="thumbnailImage"
                                            onClick={() => openOverlay(index + 1)}
                                        />
                                    ))}
                                    {car.images.length > 5 && (
                                        <div className="extraImagesOverlay">
                                            +{car.images.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='carDetailsleftandrightpart'>
                                <div className="carInfo">
                                    <p>Provided by {car.providerName}</p>
                                    <h2>{car.company} {car.model} {car.year}</h2>
                                    <p>{car.transmissionType} • {car.fuelType} • {car.seats} Seats</p>
                                    <p>{car.carType}</p>
                                    <p>{car.pricePerHour}</p>
                                    <p>{car.pricePerDay}</p>
                                    <p>{car.city}</p>
                                    <p>{car.address}</p>

                                </div>

                                <div className='carDetailsrightside'>
                                    <div className='ratingbox'>
                                        <p className='rating'> {averageRating} <IoIosStar className='ratingstar' />
                                        </p>
                                        <p>{car.ratings.length} Reviews</p>
                                    </div>
                                    {(car.providerEmailId === userEmail || userEmail == import.meta.env.VITE_SELFSTEERADMINEMAIL) && (
                                        <>
                                            <button className='deletebtn' onClick={handleDelete}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {overlayVisible && (
                                <ImageOverlay
                                    images={car.images}
                                    initialIndex={selectedImageIndex}
                                    onClose={closeOverlay}
                                />
                            )}
                        </>
                    ) : (
                        <p>No car details found</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default CarDetails;
