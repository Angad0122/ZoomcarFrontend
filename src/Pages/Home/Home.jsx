import React, { useEffect } from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import { useUser } from '../../Contexts/AuthContext'
import './Home.css'
import CarDetailsForm from '../AddCar/AddCar'
function Home() {

    const { userId, setUserId, name, setName, userEmail, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider, logout } = useUser()

    const handleSignupSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            name: event.target.name.value,
            email: event.target.exampleInputEmail1.value,
            phone: event.target.phone.value,
            gender: event.target.gender.value,
            city: event.target.city.value,
            password: event.target.exampleInputPassword1.value,
        };
        const errors = validateSignup(formData);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setIsSubmitting(true);
            try {
                await axios.post('http://localhost:8080/auth/signup', formData);
                setEmail(formData.email);
                setOtpOpen(true);
            } catch (error) {
                console.error("There was an error requesting OTP!", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };
    return (
        <>
            <NavBar />
            <div className='homepage'>
                <div className='home-content'>
                    <div className='headings'>
                        <h2>Self Drive Car Rentals in {city}</h2>
                        <h2>Book Your Drive Now</h2>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
