import React, { useState } from 'react';
import './ImageOverlay.css';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

const ImageOverlay = ({ images, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="imageOverlay">
            <button className="closeButton" onClick={onClose}>
                <FaTimes />
            </button>
            <div className="imageContainer">
                <button className="navButton leftButton" onClick={handlePrev}>
                    <FaArrowLeft />
                </button>
                <img src={images[currentIndex]} alt={`Car Image ${currentIndex + 1}`} className="overlayImage" />
                <button className="navButton rightButton" onClick={handleNext}>
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default ImageOverlay;
