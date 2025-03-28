import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Navbar, Image } from "react-bootstrap";
import axios from "../api/axios";

const SetNewPassword = () => {
  const [tokenValid, setTokenValid] = useState(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageGreen, setMessageGreen] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  const token = getTokenFromUrl();

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage("Token nie został znaleziony w adresie URL.");
      navigate("/");
      return;
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setMessage("Hasło nie może być puste.");
      return;
    }

    setIsLoading(true);

    axios
      .post("/password-reset/reset", { token, newPassword: password })
      .then(() => {
        setMessageGreen("Hasło zostało zmienione.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((error) =>
        setMessage(error.response?.data || "Błąd przy ustawianiu hasła.")
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
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
          </Navbar>
        </Container>
      </header>
      <Container>
        <div className="rounded-3 my-4">
          <h1 className="syne text-center">Ustaw nowe hasło</h1>
        </div>
        {message && <p className="text-danger syne text-center">{message}</p>}
        {messageGreen && (
          <p className="text-success syne text-center">{messageGreen}</p>
        )}
        <div
          className="form-signin mx-auto text-center"
          style={{ maxWidth: "400px" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-floating syne mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                style={{ height: "45px" }}
              />
              <label htmlFor="password">Hasło</label>
            </div>
            <button
              className="custom-btn w-100 syne"
              type="submit"
              style={{ height: "45px", fontSize: "16px" }}
              disabled={isLoading}
            >
              {isLoading ? "Przetwarzanie..." : "Zapisz"}
            </button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default SetNewPassword;
