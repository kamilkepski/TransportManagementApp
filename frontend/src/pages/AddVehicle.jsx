import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { Container, Form, Row, Col, InputGroup } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    type: "",
    registrationNumber: "",
    VIN: "",
    brand: "",
    model: "",
    productionYear: "",
    numberOfSeats: "",
    fuelTankCapacity: "",
    mileage: "",
    technicalInspection: "",
    emissionStandard: "",
    gearboxType: "",
    numberOfAxles: "",
  });
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    try {
      const response = await axiosPrivate.post("/vehicles", formData, {
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data.message);
      navigate("/pojazdy");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || "Wystąpił błąd. Spróbuj ponownie.");
      } else if (error.request) {
        alert("Serwer nie odpowiada.");
      } else {
        alert("Coś poszło nie tak: " + error.message);
      }
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="rounded-3 my-4">
          <h1 className="syne">Dodawanie nowego pojazdu</h1>
        </div>
        <Form onSubmit={handleSubmit}>
          <h4 className="mb-3 syne">Podstawowe informacje</h4>
          <Row className="g-3 inter">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Kategoria <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="" hidden>
                    Wybierz
                  </option>
                  <option value="Autobus">Autobus</option>
                  <option value="Bus">Bus</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Numer rejestracyjny <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  VIN (opcjonalnie)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="VIN"
                  value={formData.VIN}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Marka <span className="text-danger">*</span>
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
                  Model (opcjonalnie)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Rok produkcji <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="productionYear"
                  value={formData.productionYear}
                  onChange={handleChange}
                  min="1990"
                  max="2025"
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Liczba miejsc <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="numberOfSeats"
                  value={formData.numberOfSeats}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Pojemność zbiornika paliwa{" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="fuelTankCapacity"
                    value={formData.fuelTankCapacity}
                    onChange={handleChange}
                    min="50"
                    required
                  />
                  <InputGroup.Text
                    className="syne"
                    style={{
                      backgroundColor: "rgb(9, 128, 76)",
                      color: "#FFF",
                    }}
                  >
                    l
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />

          <h4 className="mb-3 syne">Dodatkowe informacje</h4>

          <Row className="g-3 inter">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Aktualny przebieg <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                  <InputGroup.Text
                    className="syne"
                    style={{
                      backgroundColor: "rgb(9, 128, 76)",
                      color: "#FFF",
                    }}
                  >
                    km
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Data ważności przeglądu technicznego{" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="technicalInspection"
                  value={formData.technicalInspection}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Norma emisji spalin (opcjonalnie)
                </Form.Label>
                <Form.Select
                  name="emissionStandard"
                  value={formData.emissionStandard}
                  onChange={handleChange}
                >
                  <option value="" hidden>
                    Wybierz
                  </option>
                  <option value="Euro 0">Euro 0</option>
                  <option value="Euro 1">Euro 1</option>
                  <option value="Euro 2">Euro 2</option>
                  <option value="Euro 3">Euro 3</option>
                  <option value="Euro 4">Euro 4</option>
                  <option value="Euro 5">Euro 5</option>
                  <option value="Euro 6">Euro 6</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Rodzaj skrzyni biegów (opcjonalnie)
                </Form.Label>
                <Form.Select
                  name="gearboxType"
                  value={formData.gearboxType}
                  onChange={handleChange}
                >
                  <option value="" hidden>
                    Wybierz
                  </option>
                  <option value="Manualna">Manualna</option>
                  <option value="Automatyczna">Automatyczna</option>
                  <option value="Pół automatyczna">Pół automatyczna</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Liczba osi (opcjonalnie)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="numberOfAxles"
                  value={formData.numberOfAxles}
                  onChange={handleChange}
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

export default AddVehicle;
