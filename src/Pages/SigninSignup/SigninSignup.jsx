import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SigninSignup.css';
import { useUser } from '../../Contexts/AuthContext';

function SigninSignup() {
    const { userId, setUserId, name, setName, userEmail,userRole,setUserRole, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider,
        carsProvided, setCarsProvided, logout } = useUser()

    const [signUpOpen, setSignUpOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [otpOpen, setOtpOpen] = useState(false);
    const [otp, setOtp] = useState('');
    const [loginOtp, setLoginOtp] = useState(false)
    const [otpErrors, setOtpErrors] = useState({});
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const validateSignup = (values) => {
        let errors = {};
        if (!values.name) {
            errors.name = "Name is required";
        }
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Email address is invalid";
        }
        if (!values.phone) {
            errors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(values.phone)) {
            errors.phone = "Phone number is invalid";
        }
        if (!values.gender) {
            errors.gender = "Gender is required";
        }
        if (!values.city) {
            errors.city = "City is required";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        return errors;
    };
    const validateLogin = (values) => {
        let errors = {};
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Email address is invalid";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        return errors;
    };



    const handleSignupSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            name: event.target.name.value,
            email: event.target.exampleInputEmail1.value,
            phone: event.target.phone.value,
            gender: event.target.gender.value,
            city: event.target.city.value,
            password: event.target.exampleInputPassword1.value,
        };
        const errors = validateSignup(formData);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setIsSubmitting(true);
            try {
                await axios.post(`${import.meta.env.VITE_APILINK}/auth/signup`, formData, {
                    withCredentials: true
                });
                setEmail(formData.email);
                setOtpOpen(true);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    alert(error.response.data.error || "Email already in use by another user");
                } else {
                    alert("Error adding car");
                }
                console.error("There was an error requesting OTP!", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    const handleSignupOtpSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_APILINK}/auth/verify-otp`, { email, otp }, {
                withCredentials: true
            });

            if (response.data.authtoken) {
                const encryptedToken = response.data.authtoken;
    
                // Create a userData object
                const userData = {
                    userId: response.data.newUser.userId,
                    name: response.data.newUser.name,
                    email: response.data.newUser.userEmail,
                    phone: response.data.newUser.phone,
                    city: response.data.newUser.city,
                    gender: response.data.newUser.gender,
                    userRole: response.data.newUser.userRole,
                    isProvider: response.data.newUser.isProvider,
                };
    
                // Save userData and token to localStorage
                localStorage.setItem('userData', JSON.stringify(userData)); // Serialize the userData object
                localStorage.setItem('selfsteerAuthToken', encryptedToken);
            }
            setUserId(response.data.newUser.userId)
            setName(response.data.newUser.name)
            setUserEmail(response.data.newUser.email)
            setPhone(response.data.newUser.phone)
            setCity(response.data.newUser.city)
            setUserRole(response.data.newUser.userRole)
            setGender(response.data.newUser.gender)
            setIsProvider(response.data.newUser.isProvider)
            console.log( "Data log from handleSignUpOtp ", userId,name,userEmail,phone,isProvider, userRole, gender,city);
            
            navigate('/')
        } catch (error) {
            console.error("There was an error verifying OTP!", error);
            setOtpErrors({ otp: 'Invalid or expired OTP' });
        }
    };



    const handleLoginSubmit = async (event) => {
        event.preventDefault();
    
        const formData = {
            email: event.target.exampleInputEmail1.value,
            password: event.target.exampleInputPassword1.value,
        };
    
        const errors = validateLogin(formData);
        setFormErrors(errors);
    
        if (Object.keys(errors).length === 0) {
            setIsSubmitting(true);
            try {
                const response = await axios.post(`${import.meta.env.VITE_APILINK}/auth/login`, formData, {
                    withCredentials: true,
                });
    
                // Check if logged in as Admin
                if (response.data.message === "Logged in as Admin") {
                    const token = response.data.encryptedToken;
                    setName(response.data.name)
                    setUserEmail(response.data.email)
                    setUserId(response.data.userId)
                    setUserRole(response.data.userRole)
                    const adminData = {
                        name: response.data.name,
                        userEmail: response.data.email,
                        userId: response.data.userId,
                        userRole: response.data.userRole
                    }
                    // Save userData and token to localStorage
                    console.log(adminData, token);
                    localStorage.setItem("adminToken", token); // Save admin token if needed
                    localStorage.setItem('userData', JSON.stringify(adminData)); // Serialize the userData object
                    navigate("/admin"); // Navigate to Admin panel
                } else {
                    // User login workflow
                    setEmail(formData.email);
                    setLoginOtp(true);
                    setOtpOpen(true);
                }
            } catch (error) {
                console.error("Error during login:", error);
    
                if (error.response && error.response.data && error.response.data.error) {
                    alert(error.response.data.error);
                } else if (error.response) {
                    alert(`Error: ${error.response.status} - ${error.response.statusText}`);
                } else {
                    alert("An unexpected error occurred. Please try again later.");
                    console.log(error);
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    const handleLoginOtpSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APILINK}/auth/verifyloginotp`, 
                { email, otp }, 
                { withCredentials: true }
            );
    
            if (response.data.authtoken) {
                const encryptedToken = response.data.authtoken;
    
                // Create a userData object
                const userData = {
                    userId: response.data.userId,
                    name: response.data.name,
                    userEmail: response.data.userEmail,
                    phone: response.data.phone,
                    userRole:response.data.userRole,
                    city: response.data.city,
                    gender: response.data.gender,
                    isProvider: response.data.isProvider,
                    carsProvided:response.data.carsProvided,
                };
    
                // Save userData and token to localStorage
                localStorage.setItem('userData', JSON.stringify(userData)); // Serialize the userData object
                localStorage.setItem('selfsteerAuthToken', encryptedToken);
            }
    
            // Update the context or state variables with user information
            setUserId(response.data.userId);
            setName(response.data.name);
            setUserEmail(response.data.userEmail);
            setPhone(response.data.phone);
            setCity(response.data.city);
            setUserRole(response.data.userRole)
            setGender(response.data.gender);
            setIsProvider(response.data.isProvider);
            setCarsProvided(response.data.carsProvided)
            
            console.log("State updated? ", response.data.name, response.data.userId, response.data.userEmail,response.data.isProvider);
            
            // Navigate to the home page or dashboard after successful login
            navigate('/');
            console.log("data after login ",name, userId, userEmail, userRole, phone, city, gender, isProvider);
            
            
        } catch (error) {
            setOtpErrors({ otp: 'Invalid or expired OTP' });
        }
    };
    
    useEffect(() => {
        console.log("Updated data after login:", name, userId, userEmail, userRole, phone, city, gender, isProvider);
    }, [userId, name, userEmail, userRole, phone, city, gender, isProvider]);
    



    return (
        <div className="loginsignupformparent">
            {otpOpen ? (
                <>
                    {loginOtp ? (
                        <>
                            <form className='loginsignupform' onSubmit={handleLoginOtpSubmit}>
                                <h2 className='loginsignupheading'>Enter OTP</h2>
                                <div className="mb-3">
                                    <label htmlFor="otp" className="form-label text-black">OTP</label>
                                    <input type="text" className="form-control" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                    {otpErrors.otp && <span className="error-message">{otpErrors.otp}</span>}
                                </div>
                                <div className='submitbtndiv'>
                                    <button type="submit" className="submitbtn" disabled={isSubmitting}>
                                        {isSubmitting ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </div>
                            </form>

                        </>
                    ) : (
                        <>
                            <form className='loginsignupform' onSubmit={handleSignupOtpSubmit}>
                                <h2 className='loginsignupheading'>Enter OTP</h2>
                                <div className="mb-3">
                                    <label htmlFor="otp" className="form-label text-black">OTP</label>
                                    <input type="text" className="form-control" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                    {otpErrors.otp && <span className="error-message">{otpErrors.otp}</span>}
                                </div>
                                <div className='submitbtndiv'>
                                    <button type="submit" className="submitbtn" disabled={isSubmitting}>
                                        {isSubmitting ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </div>
                            </form>

                        </>
                    )}
                </>
            ) : (

                <>
                    {signUpOpen ? (
                        <>
                            <form className='loginsignupform' onSubmit={handleSignupSubmit}>
                                <h2 className='loginsignupheading'>Sign Up</h2>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label text-black">Name</label>
                                    <input type="text" className="form-control" id="name" name="name" />
                                    {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label text-black">Email address</label>
                                    <input type="email" className="form-control" id="exampleInputEmail1" name="exampleInputEmail1" aria-describedby="emailHelp" />
                                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label text-black">Phone Number</label>
                                    <input type="tel" className="form-control" id="phone" name="phone" />
                                    {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gender" className="form-label text-black">Gender</label>
                                    <select className="form-control" id="gender" name="gender">
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label text-black">City</label>
                                    <input type="text" className="form-control" id="city" name="city" />
                                    {formErrors.city && <span className="error-message">{formErrors.city}</span>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label text-black">Password</label>
                                    <input type="password" className="form-control" id="exampleInputPassword1" name="exampleInputPassword1" />
                                    {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                                </div>
                                <div className='submitbtndiv'>
                                    <button type="submit" className="submitbtn" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                                <div className="text-with-button">
                                    <p>Already have an account?</p>
                                    <button type="button" onClick={() => setSignUpOpen(false)}>Login</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <form className='loginsignupform' onSubmit={handleLoginSubmit}>
                                <h2 className='loginsignupheading'>Login</h2>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label text-black">Email address</label>
                                    <input type="email" className="form-control" id="exampleInputEmail1" name="exampleInputEmail1" aria-describedby="emailHelp" />
                                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label text-black">Password</label>
                                    <input type="password" className="form-control" id="exampleInputPassword1" name="exampleInputPassword1" />
                                    {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                                </div>
                                <div className='submitbtndiv'>
                                    <button type="submit" className="submitbtn" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                                <div className="text-with-button">
                                    <p>Don't have an account?</p>
                                    <button type="button" onClick={() => setSignUpOpen(true)}>Signup</button>
                                </div>
                            </form>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default SigninSignup;
