import React, { useEffect, useState } from 'react';
import './ProviderYourCars.css';
import { IoAdd } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import CarDetailsForm from '../../Pages/AddCar/AddCar';
import CarCard from '../CarCard/CarCard';
import { useUser } from '../../Contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function ProviderYourCars() {
  const { userId, carsProvided } = useUser();
  const [addingCar, setAddingCar] = useState(false);
  const [carsData, setCarsData] = useState([]); // State to store the fetched car data
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    console.log("car's ids provided by the user", carsProvided);

    const fetchCars = async () => {
        // Step 1: Check if "ProvidedCarsData" exists in local storage
        const cachedCarsData = localStorage.getItem("ProvidedCarsData");

        if (cachedCarsData) {
            console.log("Using cached cars data from localStorage");
            setCarsData(JSON.parse(cachedCarsData));
            setLoading(false);

            return; // Exit function to avoid unnecessary API call
        }

        // Step 2: If no cache, make API request
        if (carsProvided && carsProvided.length > 0) {
            try {
                setLoading(true);
                const response = await axios.post(`${import.meta.env.VITE_APILINK}/car/getCarsByIds`, {
                    carIds: carsProvided,
                    encryptedToken: localStorage.getItem('selfsteerAuthToken')
                });

                console.log("providerYourCar got cars data", response.data);

                // Step 3: Save fetched data to state
                setCarsData(response.data);

                // Step 4: Store the new data in localStorage
                localStorage.setItem("ProvidedCarsData", JSON.stringify(response.data));
            } catch (error) {
                console.error("Error fetching cars:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    fetchCars();
}, [carsProvided]); // Re-run when `carsProvided` changes


  return (
    <>
      <div className='headingandaddbutton'>
        <div></div>
        <h1>Your added cars</h1>
        {addingCar ? (
          <button onClick={() => setAddingCar(false)}><RxCross2 /></button>
        ) : (
          <button onClick={() => setAddingCar(true)}><IoAdd /></button>
        )}
      </div>
      
      {addingCar ? (
        <CarDetailsForm />
      ) : (
        <div className='providerCarsContainer'>
          {loading ? (
            <p className='noCarsandloadingcars'>Loading cars...</p>
          ) : (
            carsData.length > 0 ? (
              carsData.map((car) => (
                <div>
                <button onClick={(e)=>navigate("/carDetails", { state: { car } })} key={car._id}>
                  <CarCard car={car} />
                </button>
                </div>
              ))
            ) : (
              <div className='noCarsandloadingcars'>
                <p>No cars added yet.</p>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
}

export default ProviderYourCars;
