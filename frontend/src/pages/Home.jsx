import axios from "../api/axios";
import { Container, Row, Col, Image } from "react-bootstrap";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchInit = async () => {
    try {
      const response = await axios.get("/init");
      setIsAdmin(response.data.isInit)
    } catch (error) {
      console.error("Error fetching init.")
    }
  };
  
  useEffect(() => {
    fetchInit()
  });

  return (
    <>
      <Navigation />
      <Container className="px-4 py-5 my-3 text-center">
        <Image
          className="d-block mx-auto mb-4"
          src="https://cdn-icons-png.flaticon.com/512/2684/2684178.png"
          alt=""
          width="120"
          height="120"
        />
        <h1 className="display-5 fw-bold text-body-emphasis syne">
          Aplikacja do zarządzania firmą transportową
        </h1>
        <Row className="justify-content-center">
          <Col lg={6}>
            <p className="lead mb-4 syne">
              Aplikacja webowa z towarzyszącą aplikacją mobilną do zarządzania
              firmą transportową.
            </p>
          </Col>
        </Row>
        {!isAdmin && (
          <Link to="/konfiguracja">
            <button className="custom-btn inter">Utwórz konto administratora</button>
          </Link>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Home;
