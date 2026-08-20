import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
// import Navbar from '../components/Navbar.jsx'
import { BottomNav } from '../components/Navbar.jsx'
import Toast from '../components/Toast.jsx'

const Layout = () => {
  const location = useLocation();
  return (
    <div className='flex flex-col justify-between min-h-screen bg-black'>
      <Toast />
      <div key={location.pathname} className="animate-pageIn flex-1">
        <Outlet />
      </div>
      <BottomNav />

    </div>
  )
}

export default Layout