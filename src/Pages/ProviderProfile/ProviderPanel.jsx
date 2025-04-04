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
    const [selectedOption, setSelectedOption] = useState('YourCars');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Check if the screen is mobile-sized
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [logoutconfirmation, setLogoutconfirmation] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {

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
        setLogoutconfirmation(false)
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
                            <button className='text-black font-bold' onClick={() => setLogoutconfirmation(true)}>
                                <div className='logoutbuttonandlogo'>
                                    <MdExitToApp className='logoutlogo' /> Logout
                                </div>
                            </button>
                        </div>
                    </div>
                )}
                <div className="content">
                    {selectedOption === 'YourCars' && <div><ProviderYourCars /></div>}
                    {selectedOption === 'ActiveBookings' && <div>ActiveBookings</div>}
                    {selectedOption === 'BookingRequests' && <div>Booking Requests</div>}
                    {selectedOption === 'BookingHistory' && <div>Booking History</div>}
                    {selectedOption === 'Earnings' && <div>Earnings</div>}
                </div>
            </div>
            {logoutconfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg mb-4 font-semibold ">Do you want to logout</p>
                        <button
                            onClick={() => setLogoutconfirmation(false)}
                            className="bg-green-500 text-white mr-2 px-4 py-2 rounded"
                        >
                            <b>Cancel</b>
                        </button>
                        <button
                            onClick={() => logoutandgotohome(false)}
                            className="bg-red-500 text-white ml-2 px-4 py-2 rounded"
                        >
                            <b>Logout</b>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProviderPanel
