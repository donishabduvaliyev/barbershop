import React from 'react'
import { useLocation } from 'react-router-dom';

const Booking = () => {
const location = useLocation();
const serviceId = location.state?.serviceId;


  return (
    <div className='text-white'>{serviceId}</div>
  )
}

export default Booking