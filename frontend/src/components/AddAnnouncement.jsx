import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function AddAnnouncement({ onSubmit }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosPrivate.post(
        "http://localhost:8080/api/announcements",
        {
          title,
          description,
        }
      );

      if (response.status === 200 || response.status === 201) {
        if (onSubmit) onSubmit();
      }
    } catch (error) {
      console.error("Błąd podczas dodawania komunikatu:", error);
    } finally {
      setIsSubmitting(false);
      setShow(false);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <>
      <div className="gap-2 d-md-block mb-3 syne">
        <button className="custom-btn" onClick={handleShow}>
          Dodaj nowy komunikat
        </button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="syne">
              Dodawanie nowego komunikatu
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3 syne" controlId="formTitle">
              <Form.Label>Tytuł</Form.Label>
              <Form.Control
                type="text"
                placeholder="Wprowadź tytuł"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3 syne" controlId="formDescription">
              <Form.Label>Treść komunikatu</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Wprowadź treść komunikatu"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="custom-btn syne"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Zapisywanie..." : "Zapisz"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AddAnnouncement;
