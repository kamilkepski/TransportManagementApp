import { useState, useEffect } from "react";
import { Form, Button, Image } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";

import axios from "../api/axios";
const LOGIN_URL = "/login";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setErrorMessage("");
  }, [email, password]);

  useEffect(() => {
    document.body.classList.add("py-4", "bg-body-tertiary");

    return () => {
      document.body.classList.remove("py-4", "bg-body-tertiary");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role;
      await setAuth({ email, password, role, accessToken });
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      if (!error.response) {
        setErrorMessage("Wystąpił błąd połączenia z serwerem.");
      } else if (error.response?.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Wystąpił błąd podczas logowania.");
      }
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <>
      <style>
        {`
            .form-signin {
                max-width: 330px;
                padding: 1rem;
            }
            .form-signin .form-floating:focus-within {
                z-index: 2;
            }
            .form-signin input[type="email"] {
                margin-bottom: -1px;
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 0;
            }
            .form-signin input[type="password"] {
                margin-bottom: 10px;
                border-top-left-radius: 0;
                border-top-right-radius: 0;
            }
            .form-control:focus, .form-select:focus {
                border-color: #28a745;
                box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
            }
            `}
      </style>
      <section className="form-signin w-100 m-auto text-center">
        <Form
          onSubmit={handleSubmit}
          style={{ maxWidth: "360px", margin: "auto" }}
        >
          <Image
            className="mb-4"
            src="https://cdn-icons-png.flaticon.com/512/8676/8676875.png"
            alt="Ikona autobusu"
            width="100"
            height="100"
          />

          <h1 className="h4 mb-4 fw-normal syne">Zaloguj się</h1>

          <p className="error-message text-danger mb-3 syne">{errorMessage}</p>

          <Form.Group className="form-floating mb- syne">
            <Form.Control
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adres email"
              style={{ borderRadius: "8px" }}
            />
            <Form.Label htmlFor="email">Adres email</Form.Label>
          </Form.Group>

          <Form.Group className="form-floating mb-3 syne">
            <Form.Control
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Hasło"
              style={{ borderRadius: "8px" }}
            />
            <Form.Label htmlFor="password">Hasło</Form.Label>
          </Form.Group>

          <p className="syne">
            <Link to="/haslo-resetowanie" className="text-dark">
              Nie pamiętam hasła
            </Link>
          </p>

          <Button
            type="submit"
            variant="success"
            className="w-100 syne"
            style={{ borderRadius: "8px", fontSize: "16px", padding: "10px" }}
            disabled={!email.trim() || !password.trim()}
          >
            Zaloguj
          </Button>
        </Form>
      </section>
    </>
  );
};

export default Login;
