import React, { useEffect, useState } from 'react';
import './Profile.css';
import NavBar from '../../Components/NavBar/NavBar';
import { useUser } from '../../Contexts/AuthContext';
import profileLogo from '../../assets/profilelogo.jpg';
import { MdExitToApp } from "react-icons/md";
import CarDetailsForm from '../AddCar/AddCar';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { userId, setUserId, name, setName, userEmail, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider, logout } = useUser()
    const [selectedOption, setSelectedOption] = useState('ShowProfile');

    const navigate = useNavigate();
    
    useEffect(() => {
        if (!name) {
            navigate('/');
        }
    }, [name, navigate]);

    const logoutandgotohome = () => {
        logout();
        navigate('/');
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    return (
        <>
            <NavBar />
            <div className="profile-container">
                <div className="sidebar">
                    <div className="user-info">
                        <div>
                            <img className='profileimg' src={profileLogo} alt="Profile" />
                        </div>
                        <p>{name}</p>
                        <p>{userEmail}</p>
                        <p>{phone}</p>
                    </div>
                    <div className="options">
                        <hr />
                        <div>
                            <p>Profile Document</p>
                            <p>Mobile Number</p>
                            <p>Payment Wallet</p>
                        </div>
                        <hr />
                        <button
                            className={selectedOption === 'ShowProfile' ? 'active' : ''}
                            onClick={() => handleOptionClick('ShowProfile')}
                        >
                            Profile
                        </button>
                        <hr />
                        <button
                            className={selectedOption === 'ProvideCar' ? 'active' : ''}
                            onClick={() => handleOptionClick('ProvideCar')}
                        >
                            Provide Car
                        </button>
                        <hr />
                        <button
                            className={selectedOption === 'Bookings' ? 'active' : ''}
                            onClick={() => handleOptionClick('Bookings')}
                        >
                            My Bookings
                        </button>
                        <hr />
                        <button
                            className={selectedOption === 'SavedCars' ? 'active' : ''}
                            onClick={() => handleOptionClick('SavedCars')}
                        >
                            Saved Cars
                        </button>
                        <hr />
                        <button className='text-black font-bold' onClick={() => logoutandgotohome()}>
                            <div className='logoutbuttonandlogo'>
                                <MdExitToApp className='logoutlogo' /> Logout
                            </div>
                        </button>
                    </div>
                </div>
                <div className="content">
                    {selectedOption === 'ShowProfile' && <div>Your Profile</div>}
                    {selectedOption === 'ProvideCar' && <div><CarDetailsForm /></div>}
                    {selectedOption === 'Bookings' && <div>Bookings</div>}
                    {selectedOption === 'SavedCars' && <div>SavedCars</div>}
                </div>
            </div>
        </>
    );
}

export default Profile;
