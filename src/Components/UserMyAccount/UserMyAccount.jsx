import React, { useState } from 'react';
import './UserMyAccount.css';
import { useUser } from '../../Contexts/AuthContext';
import axios from 'axios';

function UserMyAccount() {
  const { userId, setUserId, name, setName, userEmail, setUserEmail, phone, setPhone, city, setCity, gender, setGender, isProvider, setIsProvider } = useUser();

  // Local state to hold temporary values for the input fields
  const [localGender, setLocalGender] = useState(gender);
  const [localCity, setLocalCity] = useState(city);
  const [localPhone, setLocalPhone] = useState(phone);

  // Track changes to know what needs to be updated
  const [changes, setChanges] = useState({ gender: false, city: false, phone: false });

  const handleGenderChange = (e) => {
    setLocalGender(e.target.value);
    setChanges((prev) => ({ ...prev, gender: true }));
  };

  const handleCityChange = (e) => {
    setLocalCity(e.target.value);
    setChanges((prev) => ({ ...prev, city: true }));
  };

  const handlePhoneChange = (e) => {
    setLocalPhone(e.target.value);
    setChanges((prev) => ({ ...prev, phone: true }));
  };

  const updateChanges = async (event) => {
    event.preventDefault();

    // Prepare the data for the update, only include changed fields
    const userUpdatedData = {
      encryptedToken: localStorage.getItem('selfsteerAuthToken'),
      userEmail:userEmail
    };

    if (changes.gender) userUpdatedData.gender = localGender;
    if (changes.city) userUpdatedData.city = localCity;
    if (changes.phone) userUpdatedData.phone = localPhone;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APILINK}/user/updateUserDetails`,
        userUpdatedData
      );

      if (response.status === 200) {
        // Update the context state if the update was successful
        if (changes.gender) setGender(localGender);
        if (changes.city) setCity(localCity);
        if (changes.phone) setPhone(localPhone);

        const userData = {
            userId: userId,
            name: name,
            userEmail: userEmail,
            phone: localPhone,
            city: localCity,
            gender: localGender,
            isProvider: isProvider
        };

        // Save userData and token to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('User details updated successfully');
      } else {
        console.error('Failed to update user details', response.data);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div className="MyAccountCotainer">
      <div className="MyAccountHeadingDiv">
        <h1 className="MyAccountHeading">My Account</h1>
      </div>

      <div className="accountInfo">
        <h2>Account Information</h2>
        <hr />
        <div>
          <div className="labelandvalue">
            <label className="label">Email:</label>
            <p className="value">{userEmail}</p>
          </div>
          <div className="labelandvalue">
            <label className="label">Phone:</label>
            <input
              type="number"
              className="input"
              placeholder={`${phone}`}
              value={localPhone}
              onChange={handlePhoneChange}
            />
          </div>
        </div>
      </div>

      <div className="personalDetails">
        <h2>Personal Details</h2>
        <hr />
        <div>
          <div className="labelandvalue">
            <label className="label">Name:</label>
            <p className="value">{name}</p>
          </div>

          <div className="labelandvalue">
            <label className="label">Gender:</label>
            <select value={localGender} onChange={handleGenderChange} className="input">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="labelandvalue">
            <label className="label">City:</label>
            <input
              type="text"
              className="input"
              value={localCity}
              onChange={handleCityChange}
            />
          </div>
        </div>
      </div>

      <div className="updateButtonDiv">
        <button className="updatebtn" onClick={updateChanges}>
          UPDATE
        </button>
      </div>
    </div>
  );
}

export default UserMyAccount;
