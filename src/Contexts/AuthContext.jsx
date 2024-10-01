import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create the UserContext
export const UserContext = createContext({
    userId: "",
    name: '',
    userEmail: '',
    phone: 0,
    city: '',
    gender: '',
    isProvider: false,
    logout: () => { }
});

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [phone, setPhone] = useState(0);
    const [city, setCity] = useState("");
    const [gender, setGender] = useState("");
    const [isProvider, setIsProvider] = useState(false);

    const logout = () => {
        localStorage.removeItem('selfsteerAuthToken');
        localStorage.removeItem('userData');
        setUserId("");
        setName("");
        setUserEmail("");
        setPhone(0);
        setCity("");
        setGender("");
        setIsProvider(false);
        alert("Logged out successfully");
    };

    useEffect(() => {
        const fetchData = async () => {
            const encryptedToken = localStorage.getItem('selfsteerAuthToken');
            const storedUserData = localStorage.getItem('userData');

            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                setUserId(userData.userId);
                setName(userData.name);
                setUserEmail(userData.userEmail);
                setPhone(userData.phone);
                setCity(userData.city);
                setGender(userData.gender);
                setIsProvider(userData.isProvider);
                console.log("User data set from localStorage", userData);
            }

            if (encryptedToken) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_APILINK}/user/verifytoken`,
                        { encryptedToken },
                        { withCredentials: true }
                    );

                    if (!response.data.success) {
                        console.error("Token verification failed");
                        logout();
                    }
                } catch (error) {
                    console.error("Error verifying token", error);
                    logout();
                }
            }
        };

        fetchData(); // Fetch user data and verify token on mount
    }, []); // No dependencies, runs once on mount

    return (
        <UserContext.Provider
            value={{ userId, setUserId, name, setName, userEmail, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider, logout }}
        >
            {children}
        </UserContext.Provider>
    );
};

// Hook to use user data from context
export function useUser() {
    return useContext(UserContext);
}
