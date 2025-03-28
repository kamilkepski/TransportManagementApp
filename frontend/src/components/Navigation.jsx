import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Image,
  Dropdown,
} from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const Navigation = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <style>
        {`
            .dropdown-item.active {
                color: rgb(255, 255, 255);
                background-color: rgb(9, 128, 76);
            }
            .dropdown-item:hover {
                color: rgb(255, 255, 255);
                background-color: rgb(9, 128, 76);
            }
            `}
      </style>
      <header className="mb-3 border-bottom">
        <Container>
          <Navbar expand="lg" className="p-3">
            <Navbar.Brand as={Link} to="/">
              <Image
                src="https://cdn-icons-png.flaticon.com/512/8676/8676875.png"
                alt="Logo"
                width={100}
                height={80}
                className="d-block mx-auto px-2"
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="main-navbar-nav" />
            <Navbar.Collapse id="main-navbar-nav">
              <Nav className="me-auto syne">
                {auth?.accessToken && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/dashboard"
                      className={isActive("/dashboard") ? "active" : ""}
                    >
                      Dashboard
                    </Nav.Link>
                    {auth?.role === "[ROLE_ADMIN]" && (
                      <NavDropdown
                        title="Pojazdy"
                        id="vehicles-dropdown"
                        className="link-body-emphasis"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="/pojazdy"
                          className={isActive("/pojazdy") ? "active" : ""}
                        >
                          Lista pojazdów
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="/przeglady"
                          className={isActive("/przeglady") ? "active" : ""}
                        >
                          Przeglądy techniczne
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="/naprawy"
                          className={isActive("/naprawy") ? "active" : ""}
                        >
                          Naprawy
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                          as={Link}
                          to="/pojazdy/dodaj"
                          className={isActive("/pojazdy/dodaj") ? "active" : ""}
                        >
                          Dodaj nowy pojazd
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="/naprawy/dodaj"
                          className={isActive("/naprawy/dodaj") ? "active" : ""}
                        >
                          Dodaj nowe zlecenie naprawy
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                    {auth?.role === "[ROLE_ADMIN]" && (
                      <NavDropdown
                        title="Zlecenia"
                        id="orders-dropdown"
                        className="link-body-emphasis"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="/zlecenia"
                          className={isActive("/zlecenia") ? "active" : ""}
                        >
                          Lista zleceń
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                          as={Link}
                          to="/zlecenia/dodaj"
                          className={
                            isActive("/zlecenia/dodaj") ? "active" : ""
                          }
                        >
                          Utwórz nowe zlecenie
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                    {auth?.role === "[ROLE_DRIVER]" && (
                      <Nav.Link
                        as={Link}
                        to="/moje-zlecenia"
                        className={isActive("/moje-zlecenia") ? "active" : ""}
                      >
                        Moje zlecenia
                      </Nav.Link>
                    )}
                    {auth?.role === "[ROLE_ADMIN]" && (
                      <NavDropdown
                        title="Trasy"
                        id="drivers-dropdown"
                        className="link-body-emphasis"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="/trasy"
                          className={isActive("/trasy") ? "active" : ""}
                        >
                          Planowanie trasy
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                          as={Link}
                          to="/trasy/historia"
                          className={
                            isActive("/trasy/historia") ? "active" : ""
                          }
                        >
                          Historia przejazdów
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                    {auth?.role === "[ROLE_ADMIN]" && (
                      <NavDropdown
                        title="Kierowcy"
                        id="drivers-dropdown"
                        className="link-body-emphasis"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="/kierowcy"
                          className={isActive("/kierowcy") ? "active" : ""}
                        >
                          Lista kierowców
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                          as={Link}
                          to="/kierowcy/dodaj"
                          className={
                            isActive("/kierowcy/dodaj") ? "active" : ""
                          }
                        >
                          Dodaj nowego kierowcę
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                    <Nav.Link
                      as={Link}
                      to="/komunikaty"
                      className={isActive("/komunikaty") ? "active" : ""}
                    >
                      Komunikaty
                    </Nav.Link>
                    {auth?.role === "[ROLE_ADMIN]" && (
                      <Nav.Link
                        as={Link}
                        to="/zgloszenia"
                        className={isActive("/zgloszenia") ? "active" : ""}
                      >
                        Zgłoszenia
                      </Nav.Link>
                    )}
                  </>
                )}
              </Nav>
              <Nav className="ms-auto syne">
                {auth?.accessToken ? (
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="link"
                      className="text-decoration-none link-body-emphasis"
                    >
                      <img
                        src="/profile-icon.png"
                        alt="Konto"
                        className="rounded-circle"
                        width={32}
                        height={32}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="text-small syne">
                      <Dropdown.Item onClick={signOut}>
                        Wyloguj się
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Nav.Link as={Link} to="/login">
                    Zaloguj się
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </header>
    </>
  );
};

export default Navigation;
