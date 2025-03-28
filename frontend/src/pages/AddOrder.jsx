import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { Container, Form, Row, Col } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AddOrder = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    phoneNumber: "",
    date: "",
    startDate: "",
    endDate: "",
    time: "",
    startPoint: "",
    destination: "",
    numberOfPassengers: "",
    assignments: [{ vehicleId: "", driver1Id: "", driver2Id: "" }],
    isMultiDay: false,
  });
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      const response = await axiosPrivate.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania informacji o pojazdach:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axiosPrivate.get("/drivers");
      setDrivers(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania informacji o kierowcach:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, []);

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

  const addVehicleAssignment = () => {
    setFormData({
      ...formData,
      assignments: [
        ...formData.assignments,
        { vehicleId: "", driver1Id: "", driver2Id: "" },
      ],
    });
  };

  const handleRemoveAssignment = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      assignments: prevFormData.assignments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);

    try {
      const response = await axiosPrivate.post("/orders", formData, {
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data);
      navigate("/zlecenia");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="rounded-3 my-4">
          <h1 className="syne">Tworzenie nowego zlecenia</h1>
        </div>
        <Form onSubmit={handleSubmit}>
          <h4 className="mb-3 syne">Dane osoby zamawiającej</h4>
          <Row className="g-3 inter">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Imię i nazwisko lub nazwa{" "}
                  <span className="text-danger">*</span>
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
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Tytuł (opcjonalnie)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col sm={6} className="d-none d-sm-block"></Col>

            <Col sm={6}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isMultiDay"
                  name="isMultiDay"
                  checked={formData.isMultiDay}
                  onChange={handleChange}
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
                  value={formData.time}
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
                  className="form-select"
                  id={`vehicle-${index}`}
                  value={assignment.vehicleId}
                  onChange={(e) =>
                    handleAssignmentChange(index, "vehicleId", e.target.value)
                  }
                  required
                >
                  <option value="" hidden>
                    Wybierz
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
                  className="form-select"
                  id={`driver1-${index}`}
                  value={assignment.driver1Id}
                  onChange={(e) =>
                    handleAssignmentChange(index, "driver1Id", e.target.value)
                  }
                  required
                >
                  <option value="" hidden>
                    Wybierz
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
                  className="form-select"
                  id={`driver2-${index}`}
                  value={assignment.driver2Id}
                  onChange={(e) =>
                    handleAssignmentChange(index, "driver2Id", e.target.value)
                  }
                >
                  <option value="" hidden>
                    Wybierz
                  </option>
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
          <button
            type="button"
            className="custom-btn syne"
            onClick={addVehicleAssignment}
          >
            Dodaj kolejny pojazd
          </button>

          <hr className="my-4" />

          <div className="text-center">
            <button className="custom-btn syne">Zapisz</button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default AddOrder;
