import React, { useState } from 'react'
import './ProviderYourCars.css'
import { IoAdd } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import CarDetailsForm from '../../Pages/AddCar/AddCar'
import CarCard from '../CarCard/CarCard'
function ProviderYourCars() {
    const [addingCar, setAddingCar] = useState(false)
    return (
        <>
            <div className='headingandaddbutton'>
                <div></div>
                <h1>Your added cars</h1>
                {addingCar ? (
                    <>
                        <button onClick={() => { setAddingCar(false) }}><RxCross2/></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => { setAddingCar(true) }}><IoAdd/></button>
                    </>
                )}
            </div>
            {addingCar ? (
                <>
                    <CarDetailsForm />
                </>
            ) : (
                <>
                <div className='providerCarsContainer'>
                    <CarCard />
                    <CarCard />
                    <CarCard />
                    <CarCard />
                    <CarCard />
                    
                </div>
                </>
            )}           
        </>
    )
}

export default ProviderYourCars
