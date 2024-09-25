import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../Contexts/AuthContext';


const PrivateRoute = ({ element: Component }) => {
    const { userId } = useUser();  // Access the user data from context
    
    // Check if the user is logged in (you can also check auth token or other logic)
    return userId ? <Component /> : <Navigate to="/auth" />;
};

export default PrivateRoute;
