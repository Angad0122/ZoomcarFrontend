import React, { useState } from 'react';
import './Sidebar.css';
import { useUser } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { name, isProvider, logout } = useUser();
    const [logoutconfirmation, setLogoutconfirmation] = useState(false)
    const navigate = useNavigate();

    const logoutandgotohome = () => {
        setLogoutconfirmation(false)
        closeSidebar()
        logout();
        navigate('/')
    }
    const handleOptionClick = (path) => {
        navigate(path);
        closeSidebar(); // Close sidebar after navigating
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                    {/* Close Button */}
                    <button className="close-button" onClick={closeSidebar}>
                        X
                    </button>

                    {/* Status Message */}
                    {name ? <p>You are logged in</p> : <p>You are not logged in</p>}

                    {/* Options */}
                    <ul className="sidebar-options">
                        <li onClick={() => handleOptionClick('/change-city')}>Change City</li>
                        <li onClick={() => handleOptionClick('/my-trips')}>My Trips</li>
                        <li onClick={() => handleOptionClick('/favourite-cars')}>Favourite Cars</li>
                        {isProvider ? (
                            <li onClick={() => handleOptionClick('/provider-profile')}>Provider Panel</li>
                        ) : (
                            <li onClick={() => handleOptionClick('/profile')}>Become a Provider</li>
                        )
                        }
                        <li onClick={() => handleOptionClick('/help-support')}>Help and Support</li>
                        {name && (
                            <li onClick={() => {
                                setLogoutconfirmation(true);
                            }}> Logout</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
            {logoutconfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1100]">
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
    );
};

export default Sidebar;
