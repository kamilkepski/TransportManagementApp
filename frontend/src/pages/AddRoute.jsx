import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "leaflet/dist/leaflet.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AddRoute = () => {
  const [map, setMap] = useState(null);
  const [control, setControl] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeTime, setRouteTime] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [address, setAddress] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    const mapInstance = L.map("map").setView([51.81965, 19.30384], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    const routingControl = L.Routing.control({
      waypoints: [],
      lineOptions: { styles: [{ color: "green", weight: 4 }] },
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      geocoder: L.Control.Geocoder.nominatim(),
      createMarker: function () {
        return null;
      },
      show: false,
    }).addTo(mapInstance);

    mapInstance.on("click", handleMapClick);
    setMap(mapInstance);
    setControl(routingControl);

    return () => {
      mapInstance.off("click", handleMapClick);
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (map) {
      map.on("click", handleMapClick);
    }

    return () => {
      if (map) {
        map.off("click", handleMapClick);
      }
    };
  }, [map]);

  const handleMapClick = async (e) => {
    console.log("Kliknięto mapę:", e.latlng);
    const latLng = e.latlng;

    try {
      const address = await reverseGeocode(latLng);
      console.log("Pobrano adres:", address);
      addPoint(latLng, address);
    } catch (error) {
      console.error("Błąd podczas obsługi kliknięcia:", error);
    }
  };

  const reverseGeocode = async (latLng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng.lat}&lon=${latLng.lng}`
      );
      const data = await response.json();
      return (
        data.display_name ||
        `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`
      );
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      return `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`;
    }
  };

  const addPoint = (latLng, address) => {
    if (!map) {
      console.error("Mapa nie jest dostępna.");
      return;
    }

    const isDuplicate = waypoints.some(
      (wp) =>
        wp.latLng.lat.toFixed(5) === latLng.lat.toFixed(5) &&
        wp.latLng.lng.toFixed(5) === latLng.lng.toFixed(5)
    );

    if (isDuplicate) {
      console.log("Duplikat punktu, nie dodano.");
      return;
    }

    const marker = L.marker(latLng).addTo(map);
    marker.bindPopup(address).openPopup();

    setWaypoints((prev) => [...prev, { latLng, address }]);
    console.log("Dodano punkt:", latLng, address);
  };

  const removePoint = (latLngToRemove) => {
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          const markerLatLng = layer.getLatLng();
          if (
            markerLatLng.lat === latLngToRemove.lat &&
            markerLatLng.lng === latLngToRemove.lng
          ) {
            map.removeLayer(layer);
          }
        }
      });
    }

    setWaypoints((prev) =>
      prev.filter(
        ({ latLng }) =>
          latLng.lat !== latLngToRemove.lat || latLng.lng !== latLngToRemove.lng
      )
    );
  };

  const addAddressPoint = async () => {
    if (!address.trim()) {
      alert("Proszę wpisać adres.");
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const results = await response.json();
      if (results.length === 0) {
        alert("Nie znaleziono adresu.");
        return;
      }

      const { lat, lon } = results[0];
      const latLng = L.latLng(lat, lon);

      const resolvedAddress = await reverseGeocode(latLng);
      addPoint(latLng, resolvedAddress);
      setAddress("");
    } catch (error) {
      console.error("Error during geocoding:", error);
    }
  };

  const finalizePoints = () => {
    if (waypoints.length < 2) {
      alert("Proszę dodać co najmniej dwa punkty, aby wygenerować trasę.");
      return;
    }

    const latLngs = waypoints.map(({ latLng }) => latLng);
    control.setWaypoints(latLngs);

    control.on("routesfound", function (e) {
      const route = e.routes[0];
      console.log(route);
      const distance = route.summary.totalDistance / 1000;
      const time = route.summary.totalTime / 3600;
      setRouteDistance(distance.toFixed(2));
      setRouteTime(time.toFixed(2));
    });
  };

  const resetMap = () => {
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    }

    setWaypoints([]);
    setRouteDistance(null);
    setRouteTime(null);

    if (control) {
      control.setWaypoints([]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      alert("Proszę wpisać ID zlecenia.");
      return;
    }

    const coordinates = waypoints.map(({ latLng }) => ({
      latitude: latLng.lat,
      longitude: latLng.lng,
    }));

    console.log("Zapisano trasę:", { coordinates });
    try {
      const response = await axiosPrivate.post(
        `/updateRoute/${orderId}`,
        { coordinates },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert(response.data);
      navigate("/trasy");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="rounded-3 my-4">
          <h1 className="syne">Planowanie trasy</h1>
        </div>

        <div className="container mb-4">
          <div className="row align-items-center mb-3 inter">
            <div className="col-12 col-md-5">
              <input
                type="text"
                className="form-control"
                id="address-input"
                placeholder="Wpisz adres lub zaznacz punkt na mapie"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-2 text-md-start mt-2 mt-md-0">
              <button
                className="custom-btn w-100 syne"
                onClick={addAddressPoint}
              >
                Dodaj punkt
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-7 mb-3 mb-lg-0">
              <div
                id="map"
                style={{
                  height: "500px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              ></div>
            </div>

            <div className="col-12 col-lg-5 inter">
              <div className="card p-3">
                <h5 className="card-title syne">Punkty trasy</h5>
                <div id="points-list" className="mb-3">
                  {waypoints.map(({ latLng, address }, index) => (
                    <div
                      key={index}
                      className="point-item mb-2 d-flex align-items-center"
                    >
                      <span className="point-label me-2 flex-grow-1">
                        Punkt: {address}
                      </span>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removePoint(latLng)}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="custom-edit-btn w-100 mb-2 syne"
                  onClick={finalizePoints}
                >
                  Zatwierdź punkty i rysuj trasę
                </button>
                <button
                  className="custom-delete-btn w-100 syne"
                  onClick={resetMap}
                >
                  Resetuj wszystko
                </button>

                {routeDistance && (
                  <div id="route-distance" className="mt-3 inter">
                    <strong>Szacowany dystans trasy:</strong> {routeDistance} km
                  </div>
                )}

                {routeTime && (
                  <div id="route-time" className="mt-3 inter">
                    <strong>Szacowany czas przejazdu:</strong>{" "}
                    {routeTime < 1
                      ? `${Math.round(routeTime * 60)} min`
                      : `${routeTime} h`}
                  </div>
                )}

                <form
                  id="route-form"
                  onSubmit={handleFormSubmit}
                  className="mt-3"
                >
                  <div className="mb-3">
                    <label htmlFor="order-id" className="form-label syne">
                      ID Zlecenia
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="order-id"
                      name="orderId"
                      placeholder="Wpisz ID zlecenia"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                    />
                  </div>

                  <button
                    id="route-save-btn"
                    className="custom-btn syne w-100"
                    type="submit"
                  >
                    Zapisz trasę
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AddRoute;
