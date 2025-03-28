import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";

const VehiclesTable = ({ vehicles, currentPage, totalPages, onPageChange }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead className="inter">
          <tr>
            <th>Numer rejestracyjny</th>
            <th>Marka i model</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {vehicles.map((vehicle) => (
            <React.Fragment key={vehicle.id}>
              <tr className="align-middle inter">
                <td>{vehicle.registrationNumber}</td>
                <td>
                  {vehicle.name} {vehicle.model}
                </td>
                <td>
                  <button
                    className="custom-edit-btn"
                    onClick={() =>
                      navigate(`/pojazdy/edytuj`, { state: { vehicle } })
                    }
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="custom-toggle-btn"
                    onClick={() => toggleRow(vehicle.id)}
                    aria-expanded={!!expandedRows[vehicle.id]}
                  >
                    <i
                      className={`bi ${
                        expandedRows[vehicle.id]
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                    ></i>
                  </button>
                </td>
              </tr>

              {expandedRows[vehicle.id] && (
                <tr>
                  <td colSpan="5" className="p-0">
                    <div className="card border-0 m-3">
                      <div className="card-body">
                        <h5 className="card-title fw-bold inter">
                          Szczegółowe informacje
                        </h5>
                        <div className="row">
                          <div className="col-md-6 inter">
                            <p>
                              <strong>Marka i model:</strong>{" "}
                              {`${vehicle.name} ${vehicle.model}` ||
                                "Brak danych"}
                            </p>
                            <p>
                              <strong>Rok produkcji:</strong>{" "}
                              {vehicle.productionYear || "Brak danych"}
                            </p>
                            <p>
                              <strong>Liczba miejsc:</strong>{" "}
                              {vehicle.numberOfSeats || "Brak danych"}
                            </p>
                          </div>
                          <div className="col-md-6 inter">
                            <p>
                              <strong>Nr rejestracyjny:</strong>{" "}
                              {vehicle.registrationNumber || "Brak danych"}
                            </p>
                            <p>
                              <strong>Przebieg:</strong>{" "}
                              {`${vehicle.mileage} km` || "Brak danych"}
                            </p>
                            <p>
                              <strong>Orientacyjny stan paliwa:</strong>{" "}
                              {vehicle.fuel != null
                                ? `${vehicle.fuel} l`
                                : "Brak danych"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <Pagination className="pagination inter">
        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Poprzednia
        </Pagination.Prev>
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <Pagination.Item
            key={pageNumber}
            active={pageNumber === currentPage}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Następna
        </Pagination.Next>
      </Pagination>
    </div>
  );
};

export default VehiclesTable;
