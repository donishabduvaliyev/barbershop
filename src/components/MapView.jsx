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

const ServiceDetailCard = ({ service, onClose, navigate, lang = 'uz', t }) => {
  if (!service) return null;
  const name = service.name?.[lang] || service.name?.uz || service.name?.en || service.name;
  const desc = service.description?.[lang] || service.description?.uz || service.description?.en || '';
  const coords = service.location?.coordinates;
  const lat = coords?.[1] || 41.3111;
  const lng = coords?.[0] || 69.2797;

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const yandexMapsUrl = `https://yandex.uz/maps/?text=${encodeURIComponent(service.address || name)}&ll=${lng},${lat}&z=16`;

  return (
    <div className="absolute bottom-20 left-0 right-0 z-[1001] p-4 animate-slide-up-fast max-w-md mx-auto">
      <div className="bg-surface/95 backdrop-blur-xl border border-border-soft rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative h-32 w-full bg-surface-2">
          <img src={service.image} alt={name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 w-7 h-7 bg-black/60 backdrop-blur-md rounded-full text-white flex items-center justify-center text-sm hover:bg-black/80 transition"
          >
            &times;
          </button>
        </div>
        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-lg text-text leading-tight">{name}</h3>
              <p className="font-semibold text-accent text-xs mt-0.5">{service.category}</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-warning/10 border border-warning/20 text-warning text-xs font-semibold shrink-0">
              <span>⭐</span>
              <span>{Number(service.rating || 5.0).toFixed(1)}</span>
            </div>
          </div>

          {service.address && (
            <p className="text-xs text-text-muted flex items-center gap-1.5 truncate">
              <span className="text-accent shrink-0">📍</span>
              <span className="truncate">{service.address}</span>
            </p>
          )}

          {desc ? (
            <p className="text-xs text-text-muted line-clamp-2">{desc}</p>
          ) : null}

          {/* External Navigation Shortcuts */}
          <div className="flex gap-2 pt-1">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-2 bg-surface-2 hover:bg-surface-3 border border-border-soft rounded-xl text-center text-xs font-semibold text-text flex items-center justify-center gap-1 transition"
            >
              <span>📍</span>
              <span>Google Maps</span>
            </a>
            <a
              href={yandexMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-2 bg-surface-2 hover:bg-surface-3 border border-border-soft rounded-xl text-center text-xs font-semibold text-text flex items-center justify-center gap-1 transition"
            >
              <span>🟡</span>
              <span>Yandex Maps</span>
            </a>
          </div>

          <button
            onClick={() => navigate(`/service/${service._id}`)}
            className="w-full py-2.5 bg-accent text-black font-bold text-sm rounded-xl hover:bg-accent-hover transition flex items-center justify-center gap-1.5 shadow-md shadow-accent/20 cursor-pointer"
          >
            <span>✂️</span>
            <span>{t ? t('ViewDetails', 'View Details & Book') : 'View Details & Book'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};


// --- MAIN MAP COMPONENT ---
const MapView = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'uz';
  const [mapLayer, setMapLayer] = useState('roadmap'); // 'roadmap' | 'satellite'
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
        {/* High-detail tile layer with building footprints, numbers, and POIs */}
        <TileLayer
          key={mapLayer}
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url={
            mapLayer === 'satellite'
              ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
              : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
          }
          maxZoom={20}
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
        <button
          onClick={() => setMapLayer((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'))}
          className="w-10 h-10 bg-surface/80 backdrop-blur-md rounded-lg shadow-md flex items-center justify-center text-base text-text hover:bg-surface transition cursor-pointer"
          title="Toggle map style (Roadmap / Satellite)"
        >
          {mapLayer === 'roadmap' ? '🛰️' : '🗺️'}
        </button>
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-10 h-10 bg-surface/80 backdrop-blur-md rounded-lg shadow-md flex items-center justify-center text-xl text-text hover:bg-surface transition cursor-pointer"
        >
          +
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-10 h-10 bg-surface/80 backdrop-blur-md rounded-lg shadow-md flex items-center justify-center text-xl text-text hover:bg-surface transition cursor-pointer"
        >
          -
        </button>
        <button
          onClick={reCenterMap}
          className="w-10 h-10 bg-surface/80 backdrop-blur-md rounded-lg shadow-md flex items-center justify-center text-text hover:bg-surface transition cursor-pointer"
          title="Recenter"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </div>

      {!userLocation && !locationError && (
        <button
          onClick={requestLocation}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[1001] px-4 py-3 bg-accent text-black text-sm font-semibold rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          {t('ShareLocation')}
        </button>
      )}

      {locationError && (
        <button
          onClick={requestLocation}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[1001] p-3 bg-danger text-white text-sm text-center rounded-lg shadow-lg max-w-[90%]"
        >
          <div>{t('LocationDenied')}</div>
          <div className="mt-1 font-semibold underline">{t('TryAgain')}</div>
        </button>
      )}

      <ServiceDetailCard
        service={selectedService}
        onClose={() => setSelectedService(null)}
        navigate={navigate}
        lang={lang}
        t={t}
      />

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
