import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../Contexts/AuthContext';
import axios from 'axios';

const PrivateRoute = () => {
    const {
        userId, // Get userId from context
        setUserId, setName, setUserEmail, setPhone, setCity, setGender, setIsProvider, carsProvided, setCarsProvided, logout
    } = useUser();
    
    const [tokenVerified, setTokenVerified] = useState(null); // null: not verified, true: valid, false: invalid
    const [loading, setLoading] = useState(true); // Manage loading state

    useEffect(() => {
        const verifyToken = async () => {
            const encryptedToken = localStorage.getItem("selfsteerAuthToken");

            if (encryptedToken) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_APILINK}/user/verifytoken`,
                        { encryptedToken },
                        { withCredentials: true }
                    );

                    if (response.data.success) { // Assuming the response contains a "success" flag
                        console.log("Token is valid: Token verified successfully");

                        // Only load user data if userId is not already set in context
                        if (!userId) {
                            // Now load user data from localStorage after verifying the token
                            const storedUserData = localStorage.getItem('userData');
                            if (storedUserData) {
                                const userData = JSON.parse(storedUserData);
                                // Set user data in context
                                setUserId(userData.userId);
                                setName(userData.name);
                                setUserEmail(userData.userEmail);
                                setPhone(userData.phone);
                                setCity(userData.city);
                                setGender(userData.gender);
                                setIsProvider(userData.isProvider);
                                setCarsProvided(userData.carsProvided);
                                console.log("User data loaded by PrivateRoute from localStorage", userData);
                            }
                        }
                        setTokenVerified(true); // Token is valid
                    } else {
                        console.error("Token is invalid:", response.data.message);
                        setTokenVerified(false); // Token is invalid
                    }
                } catch (error) {
                    console.error("Token verification failed:", error);
                    setTokenVerified(false); // Mark as invalid on error
                } finally {
                    setLoading(false); // End loading state after verification completes
                }
            } else {
                setTokenVerified(false); // No token found
                setLoading(false); // End loading
            }
        };


        if (!userId) {
            verifyToken();
        } else {
            setTokenVerified(true);  // Set tokenVerified to true since userId is found
            setLoading(false);  // If userId is already set, skip verification and stop loading
        }    
    }, [setUserId, setName, setUserEmail, setPhone, setCity, setGender, setIsProvider, logout, userId]);

    // Show loading state until token is verified
    if (loading) {
        return <div>Loading...</div>;
    }

    // If the token is verified, show the requested page (Outlet), otherwise redirect to /auth
    if (tokenVerified === true) {
        return <Outlet />;
    } else if (tokenVerified === false) {
        return <Navigate to="/auth" />;
    }

    return null; // Handle edge cases where verification isn't done correctly
};

export default PrivateRoute;
