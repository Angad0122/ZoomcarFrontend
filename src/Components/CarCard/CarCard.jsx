import React from 'react';
import Slider from 'react-slick';
import './CarCard.css';

function CarCard({ car }) {
  // Calculate the average rating
  const averageRating = car.ratings.length > 0
    ? (car.ratings.reduce((sum, rating) => sum + rating, 0) / car.ratings.length).toFixed(1)
    : 'No ratings';

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="card">
      <div className="card-image">
        <button className="favourite-btn">❤️</button>
        {car.availability ? (
          <div className="availability-circle-green"></div>
        ) : (
          <div className="availability-circle-red"></div>
        )}
        <div className="ratings">{averageRating}⭐</div>

        {/* Image Slider */}
        <Slider {...settings}>
          {car.images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Car ${index}`} className="car-image" />
            </div>
          ))}
        </Slider>
      </div>

      <div className='card-desc'>
        <div className='card-desc-left'>
          <h2 className='card-desc-left-text'>{car.company}</h2>
          <h3 className='card-desc-left-text'>{car.model.length > 15 ? `${car.model.slice(0, 15)}...` : car.model}</h3>
          <h3 className='card-desc-left-text'>{car.year}</h3>
          <hr className='card-desc-left-hr' />
          <h4 className='card-desc-left-text'>
            {car.address?.length > 15 ? `${car.address.slice(0, 15)}...` : car.address || 'No Address'}
          </h4>
          <h4 className='card-desc-left-text'>{car.city}</h4>
        </div>

        <div className='card-desc-right'>
          <p className='card-desc-right-putatend'>{car.pricePerHour}/Hour</p>
          <p className='card-desc-right-putatend'>{car.pricePerDay}/Day</p>
        </div>
      </div>
    </div>
  );
}

export default CarCard;
