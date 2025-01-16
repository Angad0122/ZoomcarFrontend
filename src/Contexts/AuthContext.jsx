import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create the UserContext
export const UserContext = createContext({
    userId: "",
    name: '',
    userEmail: '',
    userRole:'',
    phone: 0,
    city: '',
    gender: '',
    isProvider: false,
    carsProvided:[],
    logout: () => { }
});

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userRole, setUserRole] = useState("")
    const [phone, setPhone] = useState(0);
    const [city, setCity] = useState("");
    const [gender, setGender] = useState("");
    const [isProvider, setIsProvider] = useState(false);
    const [carsProvided, setCarsProvided] = useState([]);
    const [loading, setLoading] = useState(true); // New state to track loading


    const logout = () => {
        localStorage.removeItem('selfsteerAuthToken');
        localStorage.removeItem('adminToken')
        localStorage.removeItem('userData');
        setUserId("");
        setName("");
        setUserEmail("");
        setUserRole("");
        setPhone(0);
        setCity("");
        setGender("");
        setIsProvider(false);
        setCarsProvided([])
        alert("Logged out successfully");
    };

    useEffect(() => {
        const fetchData = async () => {
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                setUserId(userData.userId);
                setName(userData.name);
                setUserEmail(userData.userEmail);
                setUserRole(userData.userRole);
                setPhone(userData.phone);
                setCity(userData.city);
                setGender(userData.gender);
                setIsProvider(userData.isProvider);
                setCarsProvided(userData.carsProvided);
            }
    
            const encryptedToken = userRole === 'admin'
                ? localStorage.getItem('adminToken')
                : localStorage.getItem('selfsteerAuthToken');
    
            if (encryptedToken) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_APILINK}/user/verifytoken`,
                        { encryptedToken },
                        { withCredentials: true }
                    );
    
                    if (!response.data.success) {
                        console.error('Token verification failed');
                        logout();
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    logout();
                }
            }
            setLoading(false);
        };
    
        fetchData();
    }, []);    

    return (
        <UserContext.Provider
            value={{ userId, setUserId, name, setName, userEmail, setUserEmail, userRole, setUserRole, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider, carsProvided, setCarsProvided, logout, loading,}}
        >
            {children}
        </UserContext.Provider>
    );
};

// Hook to use user data from context
export function useUser() {
    return useContext(UserContext);
}
