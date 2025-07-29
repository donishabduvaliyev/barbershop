import React from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import MapView from './components/MapView.jsx'
import Home from './pages/Home.jsx'
import Booking from './pages/Booking.jsx'
// import CatalogforAll from './pages/catalogforAll.jsx'
import ServicePage from './pages/servicePage.jsx'
import YandexMap from './components/YandexMap.jsx'
import Layout from './Outlet/Layout.jsx'
// import CatalogforAll from './pages/CatalogforAll.jsx'

const App = () => {
  return (
      <Routes>
        <Route path="/map" element={<MapView />} />
        <Route path='/' element={<Layout />} >
        
        <Route index element={<Home />} />
        {/* <Route path="/map1" element={<YandexMap />} /> */}

        <Route path="/booking" element={<Booking />} />
        {/* <Route path="/search" element={<CatalogforAll />} /> */}
        <Route path="/service/:id" element={<ServicePage />} />
        </Route>
      </Routes>
  )
}

export default App