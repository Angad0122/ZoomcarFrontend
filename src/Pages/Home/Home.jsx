import React, { useEffect } from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import { useUser } from '../../Contexts/AuthContext'
import './Home.css'
import CarCard from '../../Components/CarCard/CarCard'
import { apilink } from '../../App'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();
    const { userId, setUserId, name, setName, userEmail, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider, logout } = useUser()
    
    return (
        <>
            <NavBar />
            <div className='homepage'>
                <div className='home-content'>
                    <div className='headings'>
                        <h2>Self Drive Car Rentals in {city ? city : <p>Your city</p>}</h2>
                        <h2>Book Your Drive Now</h2>
                    </div>
                </div>
            </div>
            <div className='carCardcontainer'>
                <div>
                    <CarCard />
                </div>
            </div>
        </>
    )
}

export default Home;
