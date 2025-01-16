import React, { useEffect, useState } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import { useUser } from '../../Contexts/AuthContext';
import './Home.css';
import CarCard from '../../Components/CarCard/CarCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const { city } = useUser();

    const [carsData, setCarsData] = useState([]); // State to store car data
    const [loading, setLoading] = useState(false); // State to track loading status

    useEffect(() => {
        const fetchRandomCars = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${import.meta.env.VITE_APILINK}/car/getRandomCars`, {
                    encryptedToken: localStorage.getItem('selfsteerAuthToken'),
                });
                // Get any three random cars from the response
                const randomCars = response.data.sort(() => 0.5 - Math.random()).slice(0, 3);
                setCarsData(randomCars);
            } catch (error) {
                console.error('Error fetching cars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomCars();
    }, []); // Empty dependency array to fetch data only on component mount

    return (
        <>
            <NavBar />
            <div className='homepage'>
                <div className='home-content'>
                    <div className='headings'>
                        <h2>Self Drive Car Rentals in {city || 'Your city'}</h2>
                        <h2>Book Your Drive Now</h2>
                    </div>
                </div>
            </div>
            <div className='carcardsandheading'>
                <h2 className='carsheading'>Cars you would like</h2>
                <div className='carCardContainer'>
                    {loading ? (
                        <p>Loading cars...</p>
                    ) : carsData.length > 0 ? (
                        carsData.map((car) => (
                            <button onClick={(e) => navigate("/carDetails", { state: { car } })} key={car._id}>
                                <CarCard key={car._id} car={car} />
                            </button>
                        ))
                    ) : (
                        <p>No cars available.</p>
                    )}
                </div>
                <button className='browseAllCarsBtn'>
                    BROWSE ALL CARS
                </button>
            </div>
        </>
    );
}

export default Home;
