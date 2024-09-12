import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SigninSignup from './Pages/SigninSignup/SigninSignup';
import Home from './Pages/Home/Home';
import { UserProvider } from './Contexts/AuthContext';
import Profile from './Pages/Profile/Profile';


// export const apilink = 'https://zoomcarbackend-fpm1.onrender.com'
export const apilink = 'http://localhost:8080'


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<SigninSignup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </UserProvider>


  );
}

export default App;
