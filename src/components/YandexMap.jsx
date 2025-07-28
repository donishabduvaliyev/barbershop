import { useEffect, useState } from "react";
import { services } from "../mock_data/barbershops"; // Your service data
import { useNavigate } from "react-router-dom";

const YandexMap = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    window.ymaps.ready(() => {
      const map = new window.ymaps.Map("map", {
        center: [41.3111, 69.2797], // Tashkent default
        zoom: 12,
        controls: ["zoomControl", "geolocationControl"],
      });

      // User Location (Geolocation)
      const geolocation = window.ymaps.geolocation;
      geolocation.get({
        provider: "browser",
        mapStateAutoApply: true,
      }).then((result) => {
        map.geoObjects.add(result.geoObjects);
      });

      // Function to add placemarks
      const addMarkers = () => {
        map.geoObjects.removeAll();

        // Re-add user location
        geolocation.get({ provider: "browser" }).then((res) => {
          map.geoObjects.add(res.geoObjects);
        });

        const filtered = categoryFilter === "All"
          ? services
          : services.filter((s) => s.category === categoryFilter);

        filtered.forEach((service) => {
          const placemark = new window.ymaps.Placemark(
            [service.latitude, service.longitude],
            {
              balloonContent: `
                <div style="max-width:200px">
                  <img src="${service.image}" width="100%" alt="${service.name}" />
                  <h4>${service.name}</h4>
                  <p><strong>${service.category}</strong></p>
                  <p>${service.description}</p>
                  <a href="/service/${service.id}">View More</a>
                </div>
              `,
              hintContent: service.name,
            },
            {
              preset: "islands#violetIcon",
            }
          );

          placemark.events.add("click", () => {
            navigate(`/service/${service.id}`);
          });

          map.geoObjects.add(placemark);
        });
      };

      addMarkers();

      // Re-render markers when category changes
      const observer = new MutationObserver(() => {
        addMarkers();
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => observer.disconnect();
    });
  }, [categoryFilter, navigate]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {/* Category Filter UI */}
      <div style={{
        position: "absolute",
        zIndex: 999,
        top: 10,
        left: 10,
        background: "white",
        padding: "8px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }}>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Barbershop">Barbershop</option>
          <option value="Hair Salon">Hair Salon</option>
          <option value="Nail Salon">Nail Salon</option>
        </select>
      </div>

      {/* Map */}
      <div id="map" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
};

export default YandexMap;
