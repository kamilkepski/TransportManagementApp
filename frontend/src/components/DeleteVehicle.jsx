import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const DeleteVehicle = ({ vehicleId }) => {
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
        `http://localhost:8080/api/vehicles/${vehicleId}`
      );

      if (response.status === 200 || response.status === 204) {
        navigate("/pojazdy");
      }
    } catch (error) {
      console.error("Błąd podczas usuwania komunikatu:", error);
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
            Potwierdzenie usunięcia pojazdu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="syne">
          Czy na pewno chcesz usunąć wybrany pojazd?
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

export default DeleteVehicle;
