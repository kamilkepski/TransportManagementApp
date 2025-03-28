import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Navigation from "../components/Navigation";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import RouteMap from "../components/RouteMap";

const RoutesHistory = () => {
  const [driverAssignments, setDriverAssignments] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedDriverAssignment, setSelectedDriverAssignment] =
    useState(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchOrders = async () => {
    try {
      const response = await axiosPrivate.get("/orders/routes");

      const filteredOrders = response.data.filter((order) => {
        return order.vehicleAssignments.some((vehicleAssignment) =>
          vehicleAssignment.driverAssignments.some(
            (driverAssignment) =>
              driverAssignment.locations &&
              driverAssignment.locations.length > 0
          )
        );
      });

      setDriverAssignments(filteredOrders);
    } catch (error) {
      console.error(
        "Błąd podczas pobierania informacji o zgłoszeniach:",
        error
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleRow = (driverAssignmentId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [driverAssignmentId]: !prev[driverAssignmentId],
    }));
  };

  const haversineDistance = (startLocation, endLocation) => {
    if (!startLocation || !endLocation) return 0;

    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const R = 6371;
    const lat1 = toRadians(startLocation.latitude);
    const lat2 = toRadians(endLocation.latitude);
    const deltaLat = toRadians(endLocation.latitude - startLocation.latitude);
    const deltaLon = toRadians(endLocation.longitude - startLocation.longitude);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateStats = (locations, driverAssignment) => {
    if (!locations || locations.length === 0) {
      return { avgSpeed: 0, travelDuration: 0, workDuration: 0, mileage: 0 };
    }

    const validSpeeds = locations
      .filter((loc) => loc.speed !== -1)
      .map((loc) => loc.speed);

    const totalSpeed = validSpeeds.reduce((sum, speed) => sum + speed, 0);
    const avgSpeed =
      validSpeeds.length > 0 ? totalSpeed / validSpeeds.length : 0;

    const travelDuration =
      locations[locations.length - 1]?.timestamp - locations[0]?.timestamp;

    const workDuration =
      new Date(driverAssignment.endTime).getTime() / 1000 -
      new Date(driverAssignment.startTime).getTime() / 1000;

    const mileage = driverAssignment.endMileage - driverAssignment.startMileage;

    const gpsDistance = haversineDistance(
      locations[0],
      locations[locations.length - 1]
    );

    return {
      avgSpeed: avgSpeed,
      travelDuration: travelDuration,
      workDuration: workDuration,
      mileage: mileage,
      gpsDistance: gpsDistance,
    };
  };

  const formatDuration = (duration) => {
    if (duration <= 0) return "Brak danych";
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatMileage = (mileage) =>
    mileage >= 0 ? `${mileage} km` : "Brak danych";

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="rounded-3 my-4">
          <h1 className="syne">Historia przejazdów</h1>
        </div>

        <table className="table">
          <thead className="inter">
            <tr>
              <th>ID zlecenia</th>
              <th>Numer rejestracyjny</th>
              <th>Data</th>
              <th>Mapa</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {driverAssignments.map((order) => {
              return order.vehicleAssignments.map((vehicleAssignment) =>
                vehicleAssignment.driverAssignments.map((driverAssignment) => {
                  const locations = driverAssignment.locations;

                  const {
                    avgSpeed,
                    travelDuration,
                    workDuration,
                    mileage,
                    gpsDistance,
                  } = calculateStats(locations, driverAssignment);

                  return (
                    <React.Fragment key={driverAssignment.id}>
                      <tr className="align-middle inter">
                        <td>{order.id}</td>
                        <td>{vehicleAssignment.vehicle?.registrationNumber}</td>
                        <td>{driverAssignment.date}</td>
                        <td>
                          <button
                            className="custom-edit-btn"
                            onClick={() =>
                              setSelectedDriverAssignment(
                                (prevDriverAssignmentId) =>
                                  prevDriverAssignmentId === driverAssignment.id
                                    ? null
                                    : driverAssignment.id
                              )
                            }
                          >
                            <i
                              className={`bi ${
                                selectedDriverAssignment === driverAssignment.id
                                  ? "bi-eye-slash"
                                  : "bi-eye"
                              }`}
                            ></i>
                          </button>
                        </td>
                        <td>
                          <button
                            className="custom-toggle-btn"
                            onClick={() => toggleRow(driverAssignment.id)}
                          >
                            <i
                              className={`bi ${
                                expandedRows[driverAssignment.id]
                                  ? "bi-chevron-up"
                                  : "bi-chevron-down"
                              }`}
                            ></i>
                          </button>
                        </td>
                      </tr>
                      {selectedDriverAssignment === driverAssignment.id &&
                        locations.length > 0 && (
                          <tr>
                            <td colSpan="5" className="p-0">
                              <div className="card border-0 m-3">
                                <div className="card-body">
                                  <RouteMap routePoints={locations} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      {expandedRows[driverAssignment.id] && (
                        <tr>
                          <td colSpan="5" className="p-0">
                            <div className="card border-0 m-3">
                              <div className="card-body">
                                <h5 className="card-title fw-bold inter">
                                  Statystyki przejazdu
                                </h5>
                                <div className="row">
                                  <div className="col-md-6 inter">
                                    <p>
                                      <strong>Średnia prędkość</strong>
                                      <small> (na podst. GPS)</small>:{" "}
                                      {(avgSpeed * 3.6).toFixed(2)} km/h
                                    </p>
                                    <p>
                                      <strong>Przejechany dystans</strong>
                                      <small> (na podst. licznika)</small>:{" "}
                                      {formatMileage(mileage)}
                                    </p>
                                    <p>
                                      <strong>Przejechany dystans</strong>
                                      <small> (na podst. GPS)</small>:{" "}
                                      {gpsDistance.toFixed(2)} km
                                    </p>
                                  </div>
                                  <div className="col-md-6 inter">
                                    <p>
                                      <strong>Czas przejazdu</strong>
                                      <small> (na podst. GPS)</small>:{" "}
                                      {formatDuration(travelDuration)}
                                    </p>
                                    <p>
                                      <strong>Czas zlecenia</strong>
                                      <small>
                                        {" "}
                                        (na podst. czasu rozp. i zak. zlecenia)
                                      </small>
                                      : {formatDuration(workDuration)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              );
            })}
          </tbody>
        </table>
      </Container>
    </>
  );
};

export default RoutesHistory;
