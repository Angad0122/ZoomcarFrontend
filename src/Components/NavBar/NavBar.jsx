import React, { useState } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import './NavBar.css';
import { useUser } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Sidebar from '../Sidebar/Sidebar';

const NavBar = () => {
  const { name, logout, isProvider, setIsProvider } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLoginSignupClick = () => {
    navigate('/auth');
  };

  const gotoprofile = () => {
    navigate('/profile');
  }

  const handleHamburgerClick = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <>
      <nav className="navbarmain">
        <div className="navbarcontainer">
          <div className="navbarleft">
            <FaBars className="navbarhamburger" onClick={handleHamburgerClick}  />
            <h1 onClick={() => navigate('/')} className="navbarlogo">Zoomcar</h1>
          </div>

          {/* Right Side of Navbar */}
          <div className="navbarright">
            {name ? (
              <>
                <button className="navbarloginbutton" onClick={() => { gotoprofile() }}>{name}</button>
                {/* <div className="relative z-5" >'
                <DropdownButton className="navbarbutton" title={name}>
                <Dropdown.Item onClick={providecarbutton}>Provide car</Dropdown.Item>
                  <hr className="m-1" />
                  <Dropdown.Item onClick={handleLogoutClick}>Logout</Dropdown.Item>
                </DropdownButton>
                </div> */}
              </>
            ) : (
              <button className="navbarloginbutton" onClick={handleLoginSignupClick}>Login</button>
            )}
            <FaUserCircle className="navbarprofile" />
          </div>
        </div>
      </nav>
      {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />}

    </>
  );
};

export default NavBar;
