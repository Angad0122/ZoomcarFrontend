import React from 'react';
import './Sidebar.css';
import { useUser } from '../../Contexts/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { isLoggedin } = useUser();

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-content">
                    <button className="close-button" onClick={closeSidebar}>X</button>
                    {isLoggedin ? (
                        <>
                            <p>You are Logged in</p>
                        </>
                    ) : (
                        <>
                            <p>You are not logged in</p>
                        </>
                    )}
                </div>
                <button onClick={closeSidebar}>Close</button>
            </div>
            
        </>
    );
};

export default Sidebar;
