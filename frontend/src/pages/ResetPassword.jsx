import React from "react";
import { useState, useEffect } from "react";
import { Form, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("py-4", "bg-body-tertiary");
    return () => {
      document.body.classList.remove("py-4", "bg-body-tertiary");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/password-reset/request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Nie udało się wysłać emaila. Sprawdź adres i spróbuj ponownie."
        );
      }
      setMessage(
        "Link do resetowania hasła został wysłany na Twój adres email."
      );
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
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
              .form-control:focus {
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
          <h1 className="h4 mb-4 fw-normal syne">Resetuj hasło</h1>

          {message && <p className="text-success">{message}</p>}
          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          <Form.Group className="form-floating mb-3 syne">
            <Form.Control
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adres email"
              style={{ borderRadius: "8px" }}
              required
            />
            <Form.Label htmlFor="email">Adres email</Form.Label>
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="w-100 syne"
            style={{ borderRadius: "8px", fontSize: "16px", padding: "10px" }}
            disabled={loading || !email.trim()}
          >
            {loading ? "Wysyłanie..." : "Wyślij link resetujący"}
          </Button>
        </Form>
      </section>
    </>
  );
};

export default ResetPassword;
