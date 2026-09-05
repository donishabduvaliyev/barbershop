import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
// import Navbar from '../components/Navbar.jsx'
import { BottomNav } from '../components/Navbar.jsx'
import Toast from '../components/Toast.jsx'

const Layout = () => {
  const location = useLocation();
  return (
    <div className='flex flex-col justify-between min-h-screen bg-bg'>
      <Toast />
      {/* BottomNav is fixed (out of flow) now, so it never reserves layout
          space here — each page reserves its own bottom clearance instead
          (its own overflow-y-auto container's padding, or the page root's
          padding for normal-flow pages). A blanket padding here would add
          unwanted scroll to full-screen pages like MapView that manage
          their own height. */}
      <div key={location.pathname} className="animate-pageIn flex-1">
        <Outlet />
      </div>
      <BottomNav />

    </div>
  )
}

export default Layout