import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { Container, Form, Row, Col } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AddDriver = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosPrivate.post("/drivers", formData, {
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data);
      navigate("/kierowcy");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="rounded-3 my-4">
          <h1 className="syne">Dodawanie nowego kierowcy</h1>
        </div>
        <Form onSubmit={handleSubmit}>
          <h4 className="mb-3 syne">Podstawowe informacje</h4>
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
                <Form.Label className="inter fw-bold">
                  Adres email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
            <button className="custom-btn syne" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Przetwarzanie...
                </>
              ) : (
                "Zapisz"
              )}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default AddDriver;
