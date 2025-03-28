import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const Missing = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <>
      <Container className="px-4 py-5 my-5 text-center">
        <h1 className="display-5 fw-bold text-body-emphasis">404</h1>
        <h1 className="display-5 fw-bold text-body-emphasis syne">
          Nie znaleziono strony...
        </h1>
        <Row className="justify-content-center">
          <Col lg={6}>
            <p className="lead mb-4 syne">
              ...prawdopodobnie nie istnieje lub jest tymczasowo niedostępna
            </p>
          </Col>
        </Row>
        <button className="custom-btn syne" onClick={goBack}>
          Wróć do poprzedniej strony
        </button>
      </Container>
    </>
  );
};

export default Missing;
