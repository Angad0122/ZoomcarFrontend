import React, { createContext, useContext, useState } from 'react';

// Create the UserContext
export const UserContext = createContext({
    userId: "",
    name: '',
    userEmail: '',
    phone: 0,
    city:'',
    gender:'',
    isProvider:false
});

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [name,setName] = useState("")
    const [userEmail,setUserEmail] = useState("")
    const [phone,setPhone] = useState(0)
    const [city,setCity] = useState("")
    const [gender,setGender] = useState("")
    const [isProvider, setIsProvider] = useState(false)


    // Function to log out the user
    const logout = () => {
        setName(null);
        setUserId(null);
        setUserEmail(null);
        setPhone(null);
        setCity(null);
        setGender(null);
        setIsProvider(false);
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ userId, setUserId,name,setName,userEmail,setUserEmail,phone,setPhone,city,setCity,gender,setGender,isProvider, setIsProvider, logout }}>
            {children}
        </UserContext.Provider>
    );
};
export function useUser(){
    return useContext(UserContext);
}




