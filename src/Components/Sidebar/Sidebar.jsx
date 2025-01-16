import React from 'react';
import './Sidebar.css';
import { useUser } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { name, isProvider, logout } = useUser();
    const navigate = useNavigate();

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
                            <li
                                onClick={() => {
                                    logout();
                                    closeSidebar();
                                    navigate('/')
                                }}
                            >
                                Logout
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
        </>
    );
};

export default Sidebar;
