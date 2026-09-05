import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/context";


// --- CUSTOM ICONS ---
const createCustomIcon = (icon) => {
  return L.divIcon({
    html: `<div class="p-2 bg-surface/80 backdrop-blur-md rounded-full shadow-lg">${icon}</div>`,
    className: 'bg-transparent border-0',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const categoryIcons = {
  Barbershop: createCustomIcon('✂️'),
  "Hair Salon": createCustomIcon('💇‍♀️'),
  "Nail Salon": createCustomIcon('💅'),
  Default: createCustomIcon('📍'),
};

const userLocationIcon = L.divIcon({
  html: `<div class="w-5 h-5 rounded-full border-2 border-white shadow-md animate-pulse" style="background:#0A84FF"></div>`,
  className: 'bg-transparent border-0',
  iconSize: [20, 20],
});

// --- HOOKS & COMPONENTS ---
const LocationMarker = ({ setUserLocation, setLocationError, mapRef }) => {
  const map = useMap();
  useEffect(() => {
    if (mapRef) mapRef.current = map;
    map.locate({ setView: true, maxZoom: 15, enableHighAccuracy: true });
    map.on("locationfound", (e) => {
      setUserLocation(e.latlng);
      map.flyTo(e.latlng, 15);
      setLocationError(null);
    });
    map.on("locationerror", () => setLocationError("denied"));
    return () => { map.off("locationfound"); map.off("locationerror"); };
  }, [map, setUserLocation, setLocationError, mapRef]);
  return null;
};

const ServiceDetailCard = ({ service, onClose , navigate }) => {
  if (!service) return null;
  return (
    <div className="absolute bottom-24 left-0 right-0 z-[1001] p-4 animate-slide-up-fast">
      <div className="bg-surface/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-32 w-full">
          <img src={service.image} alt={service.name.uz} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-xl text-text">{service.name.uz}</h3>
          <p className="font-semibold text-accent text-sm mb-2">{service.category}</p>
          <p className="text-sm text-text-muted mb-4">{service.description.uz}</p>
          <button onClick={()=>navigate(`/service/${service._id}`)} className="w-full py-2 bg-accent text-black font-semibold rounded-lg hover:bg-accent-hover transition">View Details</button>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 bg-black/20 rounded-full text-white">&times;</button>
      </div>
    </div>
  );
};


// --- MAIN MAP COMPONENT ---
const MapView = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState("All");
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const mapRef = useRef(null);
  const { navigate, services } = useAppContext();

  // Explicit, user-gesture-triggered location request. Telegram's in-app WebView
  // (and several mobile WebKit browsers) can silently ignore geolocation prompts
  // fired automatically on mount, so this is the reliable path: it runs the
  // request directly inside a tap handler, and prefers Telegram's own
  // LocationManager (native permission dialog) when the app is running inside
  // Telegram, falling back to the browser's geolocation API otherwise.
  const requestLocation = useCallback(() => {
    const tg = window.Telegram?.WebApp;

    if (tg?.LocationManager) {
      tg.LocationManager.init(() => {
        tg.LocationManager.getLocation((data) => {
          if (data) {
            const latlng = { lat: data.latitude, lng: data.longitude };
            setUserLocation(latlng);
            setLocationError(null);
            mapRef.current?.flyTo(latlng, 15);
          } else {
            setLocationError("denied");
          }
        });
      });
      return;
    }

    if (mapRef.current) {
      setLocationError(null);
      mapRef.current.locate({ setView: true, maxZoom: 15, enableHighAccuracy: true });
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(latlng);
          setLocationError(null);
        },
        () => setLocationError("denied"),
        { enableHighAccuracy: true }
      );
      return;
    }

    setLocationError("denied");
  }, []);

  const categories = ["All", "Barbershop", "Hair Salon", "Nail Salon"];

  const filteredServices = React.useMemo(() => {
    return category === "All"
      ? services
      : services.filter((s) => s.category === category);
  }, [category, services]);

  const handleSetUserLocation = useCallback((latlng) => setUserLocation(latlng), []);
  const handleSetLocationError = useCallback((message) => setLocationError(message), []);

  const reCenterMap = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo(userLocation, 15);
    } else {
      requestLocation();
    }
  };

  const handleMarkerClick = (service) => {
    setSelectedService(service);
    const coords = service.location?.coordinates;
    if (mapRef.current && coords) {
      mapRef.current.flyTo([coords[1], coords[0]], 16);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-bg font-sans relative overflow-hidden">
      {/* Header with Filters */}
      <header className="absolute top-0 left-0 right-0 z-[1001] p-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap shadow-md ${category === cat
                  ? "bg-accent text-black"
                  : "bg-surface/70 backdrop-blur-md text-text hover:bg-surface"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <MapContainer
        center={[41.3111, 69.2797]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false} // Disable default zoom control
      >
        {/* Apple Maps-style Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <LocationMarker
          setUserLocation={handleSetUserLocation}
          setLocationError={handleSetLocationError}
          mapRef={mapRef}
        />

        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {filteredServices.map((shop) => {
          const coords = shop.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          const icon = categoryIcons[shop.category] || categoryIcons.Default;
          return (
            <Marker
              key={shop.id}
              position={[coords[1], coords[0]]}
              icon={icon}
              eventHandlers={{ click: () => handleMarkerClick(shop) }}
            />
          );
        })}
      </MapContainer>

      {/* iOS-style UI Controls */}
      <div className="absolute top-20 right-3 z-[1000] flex flex-col space-y-2">
        <button onClick={() => mapRef.current?.zoomIn()} className="w-10 h-10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-lg shadow-md flex items-center justify-center text-xl">+</button>
        <button onClick={() => mapRef.current?.zoomOut()} className="w-10 h-10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-lg shadow-md flex items-center justify-center text-xl">-</button>
      </div>
      <button
        onClick={reCenterMap}
        className="absolute top-44 right-3 z-[1000] w-10 h-10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-lg shadow-md flex items-center justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
      </button>

      {!userLocation && !locationError && (
        <button
          onClick={requestLocation}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] px-4 py-3 bg-accent text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          {t('ShareLocation')}
        </button>
      )}

      {locationError && (
        <button
          onClick={requestLocation}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1001] p-3 bg-red-500 text-white text-sm text-center rounded-lg shadow-lg max-w-[90%]"
        >
          <div>{t('LocationDenied')}</div>
          <div className="mt-1 font-semibold underline">{t('TryAgain')}</div>
        </button>
      )}

      <ServiceDetailCard service={selectedService} onClose={() => setSelectedService(null)} navigate={navigate} />

      <style>{`
                /* Custom Leaflet Popup Style */
                .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    padding: 0;
                }
                .leaflet-popup-content {
                    margin: 0;
                    width: 240px !important;
                }
                .leaflet-popup-tip-container {
                    display: none;
                }
                .leaflet-container a.leaflet-popup-close-button {
                    color: #333;
                    padding: 8px 8px 0 0;
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes slide-up-fast {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up-fast {
                    animation: slide-up-fast 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
            `}</style>
    </div>
  );
};

export default MapView;
