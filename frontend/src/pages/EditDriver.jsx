import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Row, Col } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navigation from "../components/Navigation";
import Missing from "../components/Missing";
import DeleteDriver from "../components/DeleteDriver";

const EditDriver = () => {
  const location = useLocation();
  const driver = location.state?.driver;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  if (!driver) {
    return <Missing />;
  }

  const [formData, setFormData] = useState({
    id: driver?.id || "",
    firstName: driver?.firstName || "",
    lastName: driver?.lastName || "",
    phoneNumber: driver?.phoneNumber || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    try {
      const response = await axiosPrivate.put(`/drivers/${formData.id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data);
      navigate("/kierowcy");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap my-4">
          <h1 className="syne">Edytowanie profilu kierowcy</h1>
          <DeleteDriver driverId={formData.id} />
        </div>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3 inter">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Imię <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Nazwisko <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">Adres email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={driver.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="inter fw-bold">
                  Numer telefonu (opcjonalnie)
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
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

export default EditDriver;
