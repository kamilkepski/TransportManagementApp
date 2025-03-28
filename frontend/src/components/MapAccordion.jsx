import { useEffect, useRef } from "react";
import Accordion from "react-bootstrap/Accordion";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";

const MapAccordion = ({ routePoints }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const waypointsRef = useRef([]);

  const initializeMap = () => {
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [51.81965, 19.30384],
        13
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
          const marker = L.marker([point.latitude, point.longitude]).addTo(map);
          marker.bindPopup(
            `Punkt ${index + 1}: ${point.latitude}, ${point.longitude}`
          );
          marker.bindTooltip(`Punkt ${index + 1}`, {
            permanent: true,
            direction: "bottom",
          });
          waypoints.push(L.latLng(point.latitude, point.longitude));
        }
      });
      waypointsRef.current = waypoints;

      if (waypoints.length > 1) {
        L.Routing.control({
          waypoints,
          lineOptions: { styles: [{ color: "green", weight: 4 }] },
          routeWhileDragging: false,
          draggableWaypoints: false,
          addWaypoints: false,
          fitSelectedRoutes: false,
          showAlternatives: false,
          geocoder: L.Control.Geocoder.nominatim(),
          createMarker: () => null,
          show: false,
        }).addTo(map);
      }
    }
  };

  useEffect(() => {
    initializeMap();
  }, [routePoints]);

  const handleAccordionToggle = (isOpen) => {
    if (isOpen && mapRef.current) {
      setTimeout(() => {
        const map = mapRef.current;

        map.invalidateSize();

        const waypoints = waypointsRef.current;
        if (waypoints.length > 0) {
          const bounds = L.latLngBounds(waypoints);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }, 300);
    }
  };

  return (
    <Accordion.Item eventKey="2">
      <Accordion.Header
        className="syne"
        onClick={() => handleAccordionToggle(true)}
      >
        <h4>Trasa</h4>
      </Accordion.Header>
      <Accordion.Body>
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
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default MapAccordion;
