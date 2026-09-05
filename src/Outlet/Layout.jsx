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
      {/* BottomNav is fixed (out of flow) — this reserves space so trailing
          page content (e.g. a page-ending button) never ends up hidden
          behind it. */}
      <div key={location.pathname} className="animate-pageIn flex-1 pb-24">
        <Outlet />
      </div>
      <BottomNav />

    </div>
  )
}

export default Layout