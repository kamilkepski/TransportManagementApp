import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Row, Col, Alert } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navigation from "../components/Navigation";
import Missing from "../components/Missing";
import DeleteRepair from "../components/DeleteRepair";

const EditRepair = () => {
  const [vehicles, setVehicles] = useState([]);
  const location = useLocation();
  const repair = location.state?.repair;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  if (!repair) {
    return <Missing />;
  }

  const [formData, setFormData] = useState({
    id: repair?.id || "",
    title: repair?.title || "",
    description: repair?.description || "",
    vehicleId: repair?.vehicle.id || "",
    repairDate: repair?.repairDate
      ? new Date(repair?.repairDate).toISOString().split("T")[0]
      : "",
  });

  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axiosPrivate.get("/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania informacji o pojazdach:", error);
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.put(`/repairs/${formData.id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setAlert({ type: "success", message: "Zlecenie naprawy zostało zaktualizowane." });

      setTimeout(() => {
        navigate("/naprawy");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);

      setAlert({ type: "danger", message: "Wystąpił błąd podczas zapisu. Spróbuj ponownie." });
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap my-4">
          <h1 className="syne">Edytowanie zlecenia naprawy</h1>
          <DeleteRepair repairId={formData.id} />
        </div>

        {/* 🚀 Bootstrapowy Alert */}
        {alert && (
          <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
            {alert.message}
          </Alert>
        )}

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
                <Form.Label className="inter fw-bold">Data naprawy (opcjonalnie)</Form.Label>
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

export default EditRepair;
