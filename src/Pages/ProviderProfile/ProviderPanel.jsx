import React, { useEffect, useState } from 'react'
import './ProviderPanel.css'

import NavBar from '../../Components/NavBar/NavBar'
import { useUser } from '../../Contexts/AuthContext';
import profileLogo from '../../assets/profilelogo.jpg';
import { MdExitToApp } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import ProviderYourCars from '../../Components/ProviderYourCars/ProviderYourCars';
function ProviderPanel() {


    const { userId, setUserId, name, setName, userEmail, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider, logout } = useUser();
    const [selectedOption, setSelectedOption] = useState('ShowProfile');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Check if the screen is mobile-sized
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!name) {
            navigate('/');
        }

        // Adjust height based on content
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer.scrollHeight > window.innerHeight) {
            document.body.classList.add('content-overflowing');
        } else {
            document.body.classList.remove('content-overflowing');
        }

        // Update mobile state on resize
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsSidebarVisible(true); // Always show sidebar on larger screens
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [name, navigate, selectedOption]);

    const logoutandgotohome = () => {
        logout();
        navigate('/');
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        if (isMobile) {
            setIsSidebarVisible(false); // Hide sidebar on mobile after option click
        }
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };




    return (
        <>
        <NavBar/>
        {isMobile && (
                <div className="mobile-header">
                    <button onClick={toggleSidebar}>Menu</button>
                </div>
            )}
            <div className={`profile-container ${isSidebarVisible ? '' : 'hide-sidebar'}`}>
                {isSidebarVisible && (
                    <div className="profile-sidebar">
                        <div className="user-info">
                            <div>
                                <img className='profileimg' src={profileLogo} alt="Profile" />
                            </div>
                            <p>{name}</p>
                            <p>{userEmail}</p>
                            <p>{phone}</p>
                        </div>
                        <div className="options">
                            
                            <button
                                className={selectedOption === 'ShowProfile' ? 'active' : ''}
                                onClick={() => handleOptionClick('ShowProfile')}
                            >
                                Profile
                            </button>
                            <hr />
                            <button
                                className={selectedOption === 'YourCars' ? 'active' : ''}
                                onClick={() => handleOptionClick('YourCars')}
                            >
                                Your Cars
                            </button>
                            <hr />
                            <button
                                className={selectedOption === 'ActiveBookings' ? 'active' : ''}
                                onClick={() => handleOptionClick('ActiveBookings')}
                            >
                                Active Bookings
                            </button>
                            <hr />
                            <button
                                className={selectedOption === 'BookingRequests' ? 'active' : ''}
                                onClick={() => handleOptionClick('BookingRequests')}
                            >
                                Booking Requests
                            </button>
                            <hr />
                            <button
                                className={selectedOption === 'BookingHistory' ? 'active' : ''}
                                onClick={() => handleOptionClick('BookingHistory')}
                            >
                                Booking History
                            </button>
                            <hr />
                            <button
                                className={selectedOption === 'Earnings' ? 'active' : ''}
                                onClick={() => handleOptionClick('Earnings')}
                            >
                                Earnings
                            </button>
                            <hr />
                            <button className='text-black font-bold' onClick={() => logoutandgotohome()}>
                                <div className='logoutbuttonandlogo'>
                                    <MdExitToApp className='logoutlogo' /> Logout
                                </div>
                            </button>
                        </div>
                    </div>
                )}
                <div className="content">
                    {selectedOption === 'ShowProfile' && <div>Your Profile</div>}
                    {selectedOption === 'YourCars' && <div><ProviderYourCars /></div>}
                    {selectedOption === 'ActiveBookings' && <div>ActiveBookings</div>}
                    {selectedOption === 'BookingRequests' && <div>Booking Requests</div>}
                    {selectedOption === 'BookingHistory' && <div>Booking History</div>}
                    {selectedOption === 'Earnings' && <div>Earnings</div>}
                </div>
            </div>

        </>
    )
}

export default ProviderPanel
