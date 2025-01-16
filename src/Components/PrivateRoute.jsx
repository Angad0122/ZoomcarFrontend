import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../Contexts/AuthContext';
import axios from 'axios';
import MainLoader from './LoadingPage/MainLoader';

const PrivateRoute = ({ requiredRole }) => {
    const { logout, userRole } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const storedUserData = JSON.parse(localStorage.getItem('userData'));
                const token = localStorage.getItem(
                    storedUserData?.userRole === 'admin' ? 'adminToken' : 'selfsteerAuthToken'
                );

                if (!storedUserData || !token) {
                    console.warn('Missing user data or token. Redirecting to login.');
                    setIsAuthenticated(false);
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_APILINK}/user/verifytoken`,
                    { encryptedToken: token },
                    { withCredentials: true }
                );

                if (response.data.success) {
                    const userRole = response.data.userRole;

                    // Check for role mismatch if requiredRole is provided
                    if (requiredRole && userRole !== requiredRole) {
                        console.error(
                            `Unauthorized access: User role "${userRole}" does not match required role "${requiredRole}"`
                        );
                        alert("You don't have access to this page.");
                        navigate('/');
                        setIsAuthenticated(false);
                        return;
                    }

                    // Restrict `Profile` page to only renter or provider
                    if (!requiredRole && userRole === 'admin' && window.location.pathname === '/profile') {
                        alert("You don't have access to this page.");
                        navigate('/');
                        setIsAuthenticated(false);
                        return;
                    }

                    setIsAuthenticated(true);
                } else {
                    console.warn('Token verification failed:', response.data.message);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, [requiredRole, navigate]);

    if (loading) {
        return <MainLoader />;
    }

    if (isAuthenticated === true) {
        return <Outlet />;
    } else if (isAuthenticated === false) {
        alert("You don't have access to this page.");
        navigate('/');
        return null; // Avoid rendering anything
    }
};

export default PrivateRoute;
