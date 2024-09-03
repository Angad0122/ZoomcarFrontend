import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SigninSignup.css';
import Home from '../Home/Home';
import { useUser } from '../../Contexts/AuthContext';
import { apilink } from '../../App';

function SigninSignup() {

    const { userId, setUserId, name, setName, userEmail, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider, logout } = useUser()

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
                await axios.post(`${apilink}/auth/signup`, formData);
                setEmail(formData.email);
                setOtpOpen(true);
            } catch (error) {
                console.error("There was an error requesting OTP!", error);
            } finally {
                setIsSubmitting(false);
            }
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
                const response = await axios.post(`${apilink}/auth/login`, formData);
                setEmail(formData.email);
                setLoginOtp(true);
                setOtpOpen(true);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    alert(error.response.data.error);
                } else {
                    alert("An unexpected error occurred. Please try again later.");
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apilink}/auth/verify-otp`, { email, otp });
            setUserId(response.data.newUser.userId)
            setName(response.data.newUser.name)
            setUserEmail(response.data.newUser.email)
            setPhone(response.data.newUser.phone)
            setCity(response.data.newUser.city)
            setGender(response.data.newUser.gender)
            setIsProvider(response.data.newUser.isProvider)
            navigate('/')
        } catch (error) {
            console.error("There was an error verifying OTP!", error);
            setOtpErrors({ otp: 'Invalid or expired OTP' });
        }
    };
    const handleLoginOtpSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${apilink}/auth/verifyloginotp`, { email, otp });
            setUserId(response.data.userId)
            setName(response.data.name)
            setUserEmail(response.data.userEmail)
            setPhone(response.data.phone)
            setCity(response.data.city)
            setGender(response.data.gender)
            setIsProvider(response.data.isProvider)
            navigate('/')
            console.log(name, userEmail, phone, city, gender, isProvider);
        } catch (error) {
            setOtpErrors({ otp: 'Invalid or expired OTP' });
        }
    };



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
                            <form className='loginsignupform' onSubmit={handleOtpSubmit}>
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
