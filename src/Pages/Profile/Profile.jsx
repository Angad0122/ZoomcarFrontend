import React, { useEffect, useState } from 'react';
import './Profile.css';
import NavBar from '../../Components/NavBar/NavBar';
import { useUser } from '../../Contexts/AuthContext';
import profileLogo from '../../assets/profilelogo.jpg';
import { MdExitToApp } from "react-icons/md";
import CarDetailsForm from '../AddCar/AddCar';
import { Navigate, useNavigate } from 'react-router-dom';
import UserMyAccount from '../../Components/UserMyAccount/UserMyAccount';
import LoadingSkeleton from '../../Components/LoadingPage/LoadingProfileSkeleton';

function Profile() {
    const { userId, setUserId, name, setName, userEmail, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider, logout } = useUser();
    const [selectedOption, setSelectedOption] = useState('ShowProfile');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Check if the screen is mobile-sized
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);


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
            <NavBar />
            {loading ? (
                <div className="profile-container">
                    <LoadingSkeleton/>
                </div>
            ) : (<>
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
                                {isProvider ? (
                                    <>
                                        <button
                                            className={selectedOption === 'ProvideCar' ? 'active' : ''}
                                            onClick={() => navigate('/provider-profile')}
                                        >
                                            Provider Panel
                                        </button>

                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={selectedOption === 'ProvideCar' ? 'active' : ''}
                                            onClick={() => handleOptionClick('ProvideCar')}
                                        >
                                            Provide Car
                                        </button>
                                    </>
                                )}
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
                    )}
                    <div className="content">
                        {selectedOption === 'ShowProfile' && <div><UserMyAccount /></div>}
                        {selectedOption === 'ProvideCar' && <div><CarDetailsForm /></div>}
                        {selectedOption === 'Bookings' && <div>Bookings</div>}
                        {selectedOption === 'SavedCars' && <div>SavedCars</div>}
                    </div>
                </div>
            </>
            )}
        </>
    );
}

export default Profile;
