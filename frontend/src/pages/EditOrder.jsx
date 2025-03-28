import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Row, Col } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DeleteOrder from "../components/DeleteOrder";

const EditOrder = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phoneNumber: "",
    date: "",
    startDate: "",
    endDate: "",
    time: "",
    startPoint: "",
    destination: "",
    numberOfPassengers: "",
    assignments: [],
    isMultiDay: false,
  });

  const location = useLocation();
  const order = location.state?.order;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    if (order) {
      const parseDateTime = (isoString) => {
        if (!isoString) return { date: "", time: "" };
        const date = new Date(isoString);
        return {
          date: date.toISOString().split("T")[0],
          time: date.toTimeString().split(" ")[0].slice(0, 5),
        };
      };

      const startDateInfo = parseDateTime(order.startDate);
      const endDateInfo = parseDateTime(order.endDate);

      setFormData({
        id: order.id || "",
        name: order.name || "",
        phoneNumber: order.phoneNumber || "",
        date: order.date
          ? new Date(order.date).toISOString().split("T")[0]
          : "",
        startDate: startDateInfo.date,
        endDate: endDateInfo.date,
        time: order.time || "",
        startPoint: order.startPoint || "",
        destination: order.destination || "",
        numberOfPassengers: order.numberOfPassengers || "",
        assignments:
          order.vehicles?.map((vehicle) => ({
            vehicleId: vehicle.vehicleId,
            driver1Id: vehicle.drivers[0]?.id || "",
            driver2Id: vehicle.drivers[1]?.id || "",
          })) || [],
        isMultiDay: !!(order.startDate && order.endDate),
      });

      console.log(formData.time);
    }

    const fetchVehicles = async () => {
      try {
        const response = await axiosPrivate.get("/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania pojazdów:", error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await axiosPrivate.get("/drivers");
        setDrivers(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania kierowców:", error);
      }
    };

    fetchVehicles();
    fetchDrivers();
  }, [axiosPrivate, order]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
  };

  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...formData.assignments];
    updatedAssignments[index][field] = value;
    setFormData({ ...formData, assignments: updatedAssignments });
  };

  const handleRemoveAssignment = (index) => {
    const updatedAssignments = formData.assignments.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, assignments: updatedAssignments });
  };

  const addVehicleAssignment = () => {
    setFormData({
      ...formData,
      assignments: [
        ...formData.assignments,
        { vehicleId: "", driver1Id: "", driver2Id: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      date: formData.isMultiDay ? null : new Date(formData.date).toISOString(),
      startDate: formData.isMultiDay
        ? new Date(formData.startDate).toISOString()
        : null,
      endDate: formData.isMultiDay
        ? new Date(formData.endDate).toISOString()
        : null,
      vehicles: formData.assignments.map((assignment) => ({
        vehicleId: assignment.vehicleId,
        drivers: [
          { id: assignment.driver1Id },
          assignment.driver2Id ? { id: assignment.driver2Id } : null,
        ].filter(Boolean),
      })),
    };

    try {
      const response = await axiosPrivate.put(`/orders`, submissionData, {
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data);
      navigate("/zlecenia");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap my-4">
          <h1 className="syne">Edytowanie zlecenia</h1>
          <DeleteOrder orderId={formData.id} />
        </div>
        <Form onSubmit={handleSubmit}>
          <h4 className="mb-3 syne">Dane osoby zamawiającej</h4>
          <Row className="g-3 inter">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Imię i nazwisko <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Numer telefonu <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />
          <h4 className="mb-3 syne">Podstawowe informacje</h4>
          <Row className="g-3 inter">
            <Col sm={6}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isMultiDay"
                  name="isMultiDay"
                  checked={formData.isMultiDay}
                  onChange={handleChange}
                  disabled={order.status === "ZAKONCZONE"}
                />
                <label className="form-check-label" htmlFor="isMultiDay">
                  Wyjazd wielodniowy
                </label>
              </div>
            </Col>

            <Col sm={6} className="d-none d-sm-block"></Col>

            <div
              id="singleDateField"
              className={`col-sm-6 ${formData.isMultiDay ? "d-none" : ""}`}
            >
              <label htmlFor="date" className="form-label inter fw-bold">
                Data <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required={!formData.isMultiDay}
                disabled={order.status === "ZAKONCZONE"}
              />
            </div>

            {formData.isMultiDay && (
              <>
                <div className="col-sm-6">
                  <label
                    htmlFor="startDate"
                    className="form-label inter fw-bold"
                  >
                    Data wyjazdu <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    disabled={order.status === "ZAKONCZONE"}
                  />
                </div>

                <div className="col-sm-6">
                  <label htmlFor="endDate" className="form-label inter fw-bold">
                    Data powrotu <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    disabled={order.status === "ZAKONCZONE"}
                  />
                </div>
              </>
            )}

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Godzina podstawienia <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="time"
                  name="time"
                  value={formData.time.slice(0, 5)}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Adres podstawienia (skąd?){" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="startPoint"
                  name="startPoint"
                  value={formData.startPoint}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Adres miejsca docelowego (dokąd?){" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Liczba pasażerów <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  id="numberOfPassengers"
                  name="numberOfPassengers"
                  value={formData.numberOfPassengers}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />
          <h4 className="mb-3 syne">Pojazdy i kierowcy</h4>
          {formData.assignments.map((assignment, index) => (
            <div className="row g-3 mb-3 vehicle-assignment" key={index}>
              <div className="col-sm-4">
                <label
                  htmlFor={`vehicle-${index}`}
                  className="form-label inter fw-bold"
                >
                  Pojazd <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select inter"
                  id={`vehicle-${index}`}
                  value={assignment.vehicleId}
                  onChange={(e) =>
                    handleAssignmentChange(index, "vehicleId", e.target.value)
                  }
                  required
                  disabled={order.status === "ZAKONCZONE"}
                >
                  <option value="" hidden>
                    Wybierz pojazd
                  </option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-4">
                <label
                  htmlFor={`driver1-${index}`}
                  className="form-label inter fw-bold"
                >
                  Kierowca 1 <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select inter"
                  id={`driver1-${index}`}
                  value={assignment.driver1Id}
                  onChange={(e) =>
                    handleAssignmentChange(index, "driver1Id", e.target.value)
                  }
                  required
                  disabled={order.status === "ZAKONCZONE"}
                >
                  <option value="" hidden>
                    Wybierz kierowcę
                  </option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-4">
                <label
                  htmlFor={`driver2-${index}`}
                  className="form-label inter fw-bold"
                >
                  Kierowca 2 (opcjonalnie)
                </label>
                <select
                  className="form-select inter"
                  id={`driver2-${index}`}
                  value={assignment.driver2Id}
                  onChange={(e) =>
                    handleAssignmentChange(index, "driver2Id", e.target.value)
                  }
                  disabled={order.status === "ZAKONCZONE"}
                >
                  <option value="">Wybierz kierowcę</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {index > 0 && (
                <div className="col-12 text-end">
                  <button
                    type="button"
                    className="custom-delete-btn syne"
                    onClick={() => handleRemoveAssignment(index)}
                  >
                    <i className="bi bi-trash3"></i> Usuń
                  </button>
                </div>
              )}
            </div>
          ))}
          {order.status != "ZAKONCZONE" && (
            <button
              type="button"
              className="custom-btn syne"
              onClick={addVehicleAssignment}
            >
              Dodaj kolejny pojazd
            </button>
          )}

          <hr className="my-4" />
          <div className="text-center">
            <button className="custom-btn syne">Zapisz</button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default EditOrder;
