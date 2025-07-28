import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import marker icons correctly (ESM way)
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Import mock data (assuming it's in a file like ../mock_data/barbershops.js)
// NOTE: Make sure the path to your mock_data/barbershops.js is correct.
import { services as mockServices } from "../mock_data/barbershops.js"; // Adjusted path for typical React app structure
import { useAppContext } from "../context/context.jsx";

// Merge default Leaflet icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Component to center map on user's location and show dot
const LocationMarker = ({ setUserLocation, setLocationError, mapRef }) => {
  const map = useMap(); // Access the Leaflet map instance

  useEffect(() => {
    // Store map instance in ref for external access (e.g., re-center button)
    if (mapRef) {
      mapRef.current = map;
    }

    // Attempt to locate the user's position
    map.locate({
      setView: false, // Don't set view automatically, we'll flyTo later
      maxZoom: 15,
      enableHighAccuracy: true, // Request high accuracy location
    });

    // Event listener for successful location retrieval
    map.on("locationfound", (e) => {
      setUserLocation(e.latlng);
      map.flyTo(e.latlng, 15); // Fly to the user's location with a zoom level
      setLocationError(null); // Clear any previous location errors
    });

    // Event listener for location retrieval errors
    map.on("locationerror", (e) => {
      console.error("Geolocation error:", e.message);
      // Display a user-friendly message instead of alert()
      setLocationError("Could not retrieve your location. Please ensure location services are enabled.");
    });

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      map.off("locationfound");
      map.off("locationerror");
    };
  }, [map, setUserLocation, setLocationError, mapRef]);

  return null;
};

// Main application component
const MapWiev = () => {
  const [category, setCategory] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const { navigate, services } = useAppContext(); // Assuming useAppContext provides navigation and other context values
  // Use mockServices directly as Firebase integration is removed
  // const services = mockServices;

  // Ref to store the Leaflet map instance for external control
  const mapRef = useRef(null);

  // Define categories for filtering services
  const categories = ["All", "Barbershop", "Hair Salon", "Nail Salon"];

  // Filter services based on the selected category
  const filteredServices = React.useMemo(() => {
    return category === "All"
      ? services
      : services.filter((s) => s.category === category);
  }, [services, category]);

  // Callback to update user location, memoized for performance
  const handleSetUserLocation = useCallback((latlng) => {
    setUserLocation(latlng);
  }, []);

  // Callback to set location error message, memoized for performance
  const handleSetLocationError = useCallback((message) => {
    setLocationError(message);
  }, []);

  // Function to re-center the map on the user's location
  const reCenterMap = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo(userLocation, 15);
    } else if (!userLocation) {
      // If user location isn't available, try to locate again
      mapRef.current.locate({
        setView: true,
        maxZoom: 15,
        enableHighAccuracy: true,
      });
    }
  };


  console.log("Markers to show:", filteredServices.length);

  return (
    <div className="h-screen w-full flex flex-col font-sans">
      {/* Filter Buttons */}
      <div className="p-3 flex gap-2 overflow-x-auto bg-white shadow-md z-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full border transition-all duration-200 ease-in-out
              ${category === cat
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Location Error Message */}
      {locationError && (
        <div className="p-3 bg-red-100 text-red-800 text-sm text-center rounded-md mx-4 mt-2 shadow-sm">
          {locationError}
        </div>
      )}

      {/* Map Section */}
      <MapContainer
        center={[41.3111, 69.2797]} // Default center (Tashkent)
        zoom={13}
        scrollWheelZoom={true} // Enable scroll wheel zoom
        style={{ flex: 1, zIndex: 0, borderRadius: '0.5rem', overflow: 'hidden' }}
        className="m-4 shadow-lg rounded-lg" // Add margin, shadow, and rounded corners
      >
        <TileLayer
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* LocationMarker component to handle user location */}
        <LocationMarker
          setUserLocation={handleSetUserLocation}
          setLocationError={handleSetLocationError}
          mapRef={mapRef}
        />

        {/* User location dot and circle */}
        {userLocation && (
          <>
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={100} // Radius in meters
              pathOptions={{ fillColor: "blue", color: "blue", fillOpacity: 0.3 }}
            />
          </>
        )}

        {/* Service markers */}
        {filteredServices.map((shop) => {
          const coords = shop.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          return (
            <Marker
              key={shop.id}
              position={[coords[1], coords[0]]} // [lat, lng]
            >
              <Popup maxWidth={240}>
                <div className="flex flex-col p-2">
                  <img
                    src={shop.image || `https://placehold.co/200x100/A78BFA/ffffff?text=${shop.name.uz.split(' ')[0]}`}
                    alt={shop.name.uz}
                    className="w-full h-24 object-cover rounded-md mb-3 shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x100/A78BFA/ffffff?text=${shop.name.uz.split(' ')[0]}`; }}
                  />
                  <span className="font-bold text-lg text-gray-800">{shop.name.uz}</span>
                  <span className="text-sm text-purple-600 font-medium mb-2">{shop.category}</span>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{shop.description.uz}</p>
                  {/* Removed navigate for simplicity as react-router-dom is not fully provided */}
                  {/* <button
                  onClick={() => console.log(`Navigating to service ${shop.id}`)}
                  className="text-purple-700 hover:text-purple-900 underline text-sm font-semibold self-start transition-colors duration-200"
                >
                  View Details
                </button> */}
                  <a
                    href={`#service-${shop.id}`} // Placeholder for navigation
                    className="text-purple-700 hover:text-purple-900 underline text-sm font-semibold self-start transition-colors duration-200"
                  >
                    View Details
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Re-center button */}
      <div className="p-4 flex justify-center">
        <button
          onClick={reCenterMap}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out
            flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>Recenter Map</span>
        </button>
      </div>
    </div>
  );
};

export default MapWiev;
