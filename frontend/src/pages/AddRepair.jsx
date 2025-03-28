import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Container, Form, Row, Col } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AddRepair = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    vehicleId: "",
    repairDate: "",
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

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted data:");
    try {
      const response = await axiosPrivate.post("/repairs", formData, {
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data.message);
      navigate("/naprawy");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="rounded-3 my-4">
          <h1 className="syne">Dodawanie zlecenia naprawy pojazdu</h1>
        </div>
        <Form onSubmit={handleSubmit}>
          <h4 className="mb-3 syne">Podstawowe informacje</h4>
          <Row className="g-3 inter">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Numer rejestracyjny pojazdu, którego dotyczy naprawa
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
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
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Data naprawy (opcjonalnie)
                </Form.Label>
                <Form.Control
                  type="date"
                  name="repairDate"
                  value={formData.repairDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Tytuł <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6} className="d-none"></Col>

            <Col sm={12}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Opis naprawy <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />

          <div className="text-center">
            <button className="custom-btn syne">Zapisz</button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default AddRepair;
