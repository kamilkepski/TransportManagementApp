import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <>
      <Container className="px-4 py-5 my-5 text-center">
        <h1 className="display-5 fw-bold text-body-emphasis">403</h1>
        <h1 className="display-5 fw-bold text-body-emphasis syne">
          Brak dostępu...
        </h1>
        <Row className="justify-content-center">
          <Col lg={6}>
            <p className="lead mb-4 syne">
              ...nie posiadasz uprawnień do wyświetlenia tej strony
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

export default Unauthorized;
