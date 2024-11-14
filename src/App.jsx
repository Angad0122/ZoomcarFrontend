import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SigninSignup from './Pages/SigninSignup/SigninSignup';
import Home from './Pages/Home/Home';
import { UserProvider } from './Contexts/AuthContext';
import Profile from './Pages/Profile/Profile';
import PrivateRoute from './Components/PrivateRoute';
import ProviderPanel from './Pages/ProviderProfile/ProviderPanel';
import AdminPanel from './Pages/AdminPanel/AdminPanel';
import CarDetails from './Pages/CarDetails/CarDetails';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<SigninSignup />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route  element = {<PrivateRoute/>} >
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/provider-profile" element={<ProviderPanel/>}/>
            <Route path="/carDetails" element={<CarDetails/>}/>
          </Route>
          
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
