import React, { useState, useEffect, useContext } from "react";
import Navigation from "../components/Navigation";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [userInfo, setUserInfo] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  useEffect(() => {
    const controller = new AbortController();

    const getAnnouncements = async (pageNumber = 0) => {
      try {
        const response = await axiosPrivate.get(
          `/announcements?page=${pageNumber}`,
          {
            signal: controller.signal,
          }
        );
        const { content, totalPages } = response.data;
        setAnnouncements(content);
        setTotalPages(totalPages);
      } catch (err) {
        console.error(
          "Error fetching announcements:",
          err.response?.data || err.message
        );
      }
    };

    const getOrders = async () => {
      try {
        const response = await axiosPrivate.get("/orders/driver");
        const activeOrders = response.data.filter(
          (order) => order.status !== "ZAKONCZONE"
        );
        setOrders(activeOrders);
      } catch (err) {
        console.error(
          "Error fetching orders:",
          err.response?.data || err.message
        );
      }
    };

    const getUserName = async () => {
      try {
        const response = await axiosPrivate.get("/userinfo", {
          signal: controller.signal,
        });
        setUserInfo(response.data);
      } catch (err) {
        console.error(
          "Error fetching user info:",
          err.response?.data || err.message
        );
      }
    };

    getUserName();
    getAnnouncements();
    getOrders();

    return () => controller.abort();
  }, [axiosPrivate]);

  const getClosestOrder = () => {
    if (orders.length === 0) return null;
  
    const now = new Date();
  
    return orders
      .map((order) => {
        const timeWithoutSeconds = order.time.slice(0, 5);
  
        const orderDateTime = new Date(`${order.date}T${timeWithoutSeconds}:00`);
  
        return { ...order, dateTimeObj: orderDateTime };
      })
      .filter((order) => {
        return order.dateTimeObj >= now;
      })
      .sort((a, b) => a.dateTimeObj - b.dateTimeObj)[0] || null;
  };    

  const order = getClosestOrder();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const today = new Date();
      const dateTime = today.toLocaleString("pl-PL", {
        timeZone: "Europe/Warsaw",
      });
      setCurrentDateTime(dateTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const latestAnnouncement = announcements.length
    ? announcements[announcements.length - 1]
    : null;

  return (
    <>
      <Navigation />
      <Container>
        <div className="d-flex flex-wrap justify-content-between align-items-center my-4">
          {userInfo.firstName ? (
            <h1 className="text-body-emphasis syne">
              Witaj {userInfo.firstName}!
            </h1>
          ) : (
            <h1>Witaj!</h1>
          )}
          <h2 className="text-body-emphasis inter">{currentDateTime}</h2>
        </div>

        <Row>
          <Col md={6} className="mb-4">
            <Card className="h-100">
              <Card.Header className="bg-dark text-white syne p-3 h4">
                <i className="bi bi-megaphone"></i> Najnowszy komunikat
              </Card.Header>
              <Card.Body>
                {latestAnnouncement ? (
                  <>
                    <Card.Title className="fw-bold inter">
                      {latestAnnouncement.title}
                    </Card.Title>
                    <Card.Text className="inter">
                      {latestAnnouncement.description}
                    </Card.Text>
                    <Card.Text className="inter">
                      Data dodania:{" "}
                      {new Date(latestAnnouncement.created).toLocaleString()}
                    </Card.Text>
                  </>
                ) : (
                  <Card.Text>Brak komunikatów do wyświetlenia.</Card.Text>
                )}
              </Card.Body>
              <Card.Footer className="bg-white text-end border-top-0 syne">
                <Link to="/komunikaty">
                  <button className="custom-btn">
                    Sprawdź pozostałe komunikaty
                  </button>
                </Link>
              </Card.Footer>
            </Card>
          </Col>

          {auth?.role === "[ROLE_DRIVER]" && order && (
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Header className="bg-dark text-white syne p-3 h4">
                  <i className="bi bi-clipboard2"></i> Najbliższe zlecenie
                </Card.Header>
                <Card.Body>
                  <Card.Title className="fw-bold inter">
                    {order.title || "Brak tytułu"}
                  </Card.Title>
                  <ListGroup className="mb-2 inter" variant="flush">
                    <ListGroup.Item>
                      Termin: {new Date(order.date).toLocaleDateString()} o godz. {order.time.slice(0, 5)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Miejsce podstawienia: {order.startPoint}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Miejsce docelowe: {order.destination}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Liczba pasażerów: {order.numberOfPassengers}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="bg-white text-end border-top-0 syne">
                  <button 
                  className="custom-btn"
                  onClick={() =>
                    navigate(`/zlecenia/szczegoly`, { state: { order } })
                  }>
                    Sprawdź szczegóły zlecenia
                  </button>
                </Card.Footer>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
