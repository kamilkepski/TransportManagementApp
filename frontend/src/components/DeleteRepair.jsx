import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const DeleteRepair = ({ repairId }) => {
  const [show, setShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await axiosPrivate.delete(
        `http://localhost:8080/api/repairs/${repairId}`
      );

      if (response.status === 200 || response.status === 204) {
        navigate("/naprawy");
      }
    } catch (error) {
      console.error("Błąd podczas usuwania zlecenia:", error);
    } finally {
      setIsDeleting(false);
      setShow(false);
    }
  };

  return (
    <>
      <button className="custom-delete-btn syne" onClick={handleShow}>
        <i className="bi bi-trash3"></i> Usuń
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="syne">
            Potwierdzenie usunięcia zlecenia naprawy
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="syne">
          Czy na pewno chcesz usunąć wybrane zlecenie naprawy?
          <br /> Ta czynność jest <strong>nieodwracalna</strong>.
        </Modal.Body>
        <Modal.Footer>
          <button
            className="custom-delete-btn syne"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Usuwanie..." : "Usuń"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteRepair;
