import React, { useState } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import './NavBar.css';
import { useUser } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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

  const gotoAdmin = ()=>{
    navigate('/admin')
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
            <h1 onClick={() => navigate('/')} className="navbarlogo">SELFSTEER</h1>
          </div>

          {/* Right Side of Navbar */}
          <div className="navbarright">
            {name ? (
              <>
              {name == import.meta.env.VITE_SELFSTEERADMINNAME?(
               <button className='navbarloginbutton' onClick={()=>{ gotoAdmin()}}>{name}</button>
              ):(
                <button className="navbarloginbutton" onClick={() => { gotoprofile() }}>{name}</button>
              )}
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
