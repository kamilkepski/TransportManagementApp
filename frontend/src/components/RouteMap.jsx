import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";

const RouteMap = ({ routePoints }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const bounds = new L.LatLngBounds(
    routePoints.map((point) => [point.latitude, point.longitude])
  );

  const initializeMap = () => {
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        bounds.getCenter(),
        15
      );
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const waypoints = [];

      routePoints.forEach((point, index) => {
        if (point.latitude && point.longitude) {
          if (index === 0 || index === routePoints.length - 1) {
            const marker = L.marker([point.latitude, point.longitude]).addTo(
              map
            );
            marker.bindPopup(
              `Punkt ${index + 1}: ${point.latitude}, ${point.longitude}`
            );
            marker.bindTooltip(`Punkt ${index + 1}`, {
              permanent: false,
              direction: "bottom",
            });
          }
          waypoints.push(L.latLng(point.latitude, point.longitude));
        }
      });

      if (waypoints.length > 1) {
        L.polyline(waypoints, { color: "green", weight: 4 }).addTo(map);
      }

      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    initializeMap();
  }, [routePoints]);

  const handleResize = () => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{
        height: "500px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "100%",
      }}
    ></div>
  );
};

export default RouteMap;
