import './CarCard.css'
import React from 'react'

function CarCard() {

    
    return (
        <>
            <div className="card">
                <div className="card-image">
                    <button className="favourite-btn">❤️</button>
                    <div className="availability-circle"></div>
                    <div className="ratings">4.5⭐</div>
                </div>

                {/* =========== */}
                <div className='card-desc'>
                    <div className='card-desc-left'>
                        <div>
                            <h2>Car Company</h2>
                        </div>
                        <div>
                            <h3>Car model</h3>
                        </div>
                        <div>
                            <h3>Car year</h3>
                        </div>
                        <hr className='card-desc-left-hr' />
                        <div>
                            <h4>Car Location</h4>
                        </div>
                    </div>
                    {/* ----------*/}
                    <div className='card-desc-right'>
                        <div>
                            <p className='card-desc-right-putatend'>200/Hour</p>
                        </div>
                        <div>
                            <p className='card-desc-right-putatend'>2000/Day</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CarCard;
