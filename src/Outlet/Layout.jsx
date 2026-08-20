import React from 'react'
import { Outlet } from 'react-router-dom'
// import Navbar from '../components/Navbar.jsx'
import { BottomNav } from '../components/Navbar.jsx'
import Toast from '../components/Toast.jsx'

const Layout = () => {
  return (
    <div className='flex flex-col justify-between min-h-screen bg-black'>
      <Toast />
      <Outlet />
      <BottomNav />

    </div>
  )
}

export default Layout