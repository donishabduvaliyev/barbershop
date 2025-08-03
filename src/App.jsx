import React from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import MapView from './components/MapView.jsx'
import Home from './pages/Home.jsx'
import Booking from './pages/Booking.jsx'
import ServicePage from './pages/servicePage.jsx'
import YandexMap from './components/YandexMap.jsx'
import Layout from './Outlet/Layout.jsx'
import NotFound from './pages/NotFound.jsx'
import SearchPage from './pages/SearchPege.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path='/' element={<Layout />} >
      <Route path="/map" element={<MapView />} />

        <Route index element={<Home />} />
        {/* <Route path="/map1" element={<YandexMap />} /> */}

        <Route path="/booking" element={<Booking />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/service/:id" element={<ServicePage />} />
      </Route>
    </Routes>
  )
}

export default App