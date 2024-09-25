import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { apilink } from '../App';

// Create the UserContext
export const UserContext = createContext({
    userId: "",
    name: '',
    userEmail: '',
    phone: 0,
    city: '',
    gender: '',
    isProvider: false
});

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [phone, setPhone] = useState(0)
    const [city, setCity] = useState("")
    const [gender, setGender] = useState("")
    const [isProvider, setIsProvider] = useState(false)


    // Function to log out the user
    const logout = async () => {
        try {
            localStorage.removeItem('selfsteerAuthToken');
            setName(null);
            setUserId(null);
            setUserEmail(null);
            setPhone(null);
            setCity(null);
            setGender(null);
            setIsProvider(false);
            alert("Logged out successfully")
        } catch (error) {
            console.error("Error during logout", error);
            alert("An error occurred during logout. Please try again.");
        }


    };
    
    useEffect(() => {
        const fetchData = async () => {
            const encryptedToken = localStorage.getItem('selfsteerAuthToken');
            if (encryptedToken) {
                try {
                    // Sending encrypted token in an object
                    const response = await axios.post(`${apilink}/user/getuserdatabytoken`, { encryptedToken }, {
                        withCredentials: true
                    });
    
                    // Extracting user data from the response
                    const { userId, name, userEmail, phone, city, gender, isProvider } = response.data;
    
                    // Set user data in state
                    setUserId(userId);
                    setName(name);
                    setUserEmail(userEmail);
                    setPhone(phone);
                    setCity(city);
                    setGender(gender);
                    setIsProvider(isProvider);
                    console.log(userId, name, userEmail, phone, city, gender, isProvider);
                    
                } catch (error) {
                    console.error("Error decrypting or fetching user data", error);
                    alert("Something went wrong while getting your data");
                }
            }
        };
    
        fetchData();
    }, []);
    
    
    


    return (
        <UserContext.Provider value={{ userId, setUserId, name, setName, userEmail, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider, logout }}>
            {children}
        </UserContext.Provider>
    );
};
export function useUser() {
    return useContext(UserContext);
}




