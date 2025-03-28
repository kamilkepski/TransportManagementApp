import React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Container, Accordion } from "react-bootstrap";
import Missing from "../components/Missing";
import MapAccordion from "../components/MapAccordion";
import ReportButton from "../components/ReportButton";
import useAuth from "../hooks/useAuth";

const normalizeOrderData = (order, isAdmin) => {
  return {
    id: order.id,
    name: order.name,
    phoneNumber: order.phoneNumber,
    status: order.status,
    date: order.date || null,
    startDate: order.startDate || null,
    endDate: order.endDate || null,
    time: order.time || null,
    startPoint: order.startPoint || "",
    destination: order.destination || "",
    numberOfPassengers: order.numberOfPassengers || 0,
    vehicles: isAdmin
      ? order.vehicles
        ? order.vehicles.map((vehicle) => ({
            vehicleId: vehicle.vehicleId,
            vehicleName: vehicle.vehicleName,
            drivers: vehicle.drivers
              ? vehicle.drivers.map((driver) => ({
                  firstName: driver.firstName || "Nieznany",
                  lastName: driver.lastName || "Kierowca",
                }))
              : [],
          }))
        : []
      : [],
    routePoints: order.routePoints || [],
  };
};

const OrderDetails = () => {
  const location = useLocation();
  const rawOrder = location.state?.order;
  const { auth } = useAuth();

  if (!rawOrder) {
    return <Missing />;
  }

  const isAdmin = auth?.role === "[ROLE_ADMIN]";
  const order = normalizeOrderData(rawOrder, isAdmin);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap my-4">
          <h1 className="syne">Szczegóły zlecenia</h1>
          {isAdmin && order.status === "ZAKONCZONE" && (
            <ReportButton orderId={order.id} />
          )}
        </div>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="fw-bold syne">
              <h4>Podstawowe informacje</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div className="mx-3 my-3">
                <div className="row">
                  <div className="col-md-6 inter">
                    <p>
                      <strong>ID:</strong> {order.id}
                    </p>
                    <p>
                      <strong>Zamawiający:</strong> {order.name}
                    </p>
                    <p>
                      <strong>Tel. kontaktowy:</strong> {order.phoneNumber}
                    </p>
                    <p>
                      <strong>Liczba pasażerów:</strong>{" "}
                      {order.numberOfPassengers}
                    </p>
                  </div>
                  <div className="col-md-6 inter">
                    <p>
                      <strong>Termin:</strong>{" "}
                      {order.date
                        ? formatDate(order.date)
                        : `od ${formatDate(order.startDate)} do ${formatDate(
                            order.endDate
                          )}`}
                    </p>
                    <p>
                      <strong>Godzina podstawienia:</strong>{" "}
                      {order.time?.slice(0, 5) || "Brak danych"}
                    </p>
                    <p>
                      <strong>Skąd?:</strong> {order.startPoint}
                    </p>
                    <p>
                      <strong>Dokąd?:</strong> {order.destination}
                    </p>
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {isAdmin && order.vehicles.length > 0 && (
            <Accordion.Item eventKey="1">
              <Accordion.Header className="fw-bold syne">
                <h4>Przypisani kierowcy i pojazdy</h4>
              </Accordion.Header>
              <Accordion.Body>
                <table className="table table-borderless">
                  <thead>
                    <tr className="bg-gray-100 inter">
                      <th className="p-2 text-left border-b">Pojazd</th>
                      <th className="p-2 text-left border-b">Kierowca 1</th>
                      <th className="p-2 text-left border-b">Kierowca 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.vehicles.map((vehicle) => (
                      <tr key={vehicle.vehicleId} className="border-b inter">
                        <td className="p-2">{vehicle.vehicleName}</td>
                        <td className="p-2">
                          {vehicle.drivers[0]
                            ? `${vehicle.drivers[0].firstName} ${vehicle.drivers[0].lastName}`
                            : "Brak"}
                        </td>
                        <td className="p-2">
                          {vehicle.drivers[1]
                            ? `${vehicle.drivers[1].firstName} ${vehicle.drivers[1].lastName}`
                            : "Brak"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Accordion.Body>
            </Accordion.Item>
          )}

          <MapAccordion routePoints={order.routePoints} />
        </Accordion>
      </Container>
    </>
  );
};

export default OrderDetails;
