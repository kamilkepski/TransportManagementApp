import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Pagination } from "react-bootstrap";

const DriversTable = ({ drivers, currentPage, totalPages, onPageChange }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [workingHours, setWorkingHours] = useState({});
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    if (!expandedRows[id]) {
      fetchWorkingHours(id);
    }
  };

  const fetchWorkingHours = async (driverId) => {
    try {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      const generalResponse = await axiosPrivate.get(
        `/drivers/${driverId}/working-hours`,
        { params: { month, year } }
      );

      const limitsResponse = await axiosPrivate.get(
        `/drivers/${driverId}/working-hours/limits`,
        { params: { month, year } }
      );

      setWorkingHours((prev) => ({
        ...prev,
        [driverId]: {
          general: generalResponse.data,
          limits: limitsResponse.data,
        },
      }));
    } catch (error) {
      console.error(
        `Błąd podczas pobierania godzin pracy dla kierowcy ${driverId}:`,
        error
      );
      setWorkingHours((prev) => ({
        ...prev,
        [driverId]: "Błąd pobierania danych",
      }));
    }
  };

  return (
    <>
      <table className="table">
        <thead className="inter">
          <tr>
            <th>ID</th>
            <th>Imię i nazwisko</th>
            <th>Status</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {drivers.map((driver) => (
            <React.Fragment key={driver.id}>
              <tr className="align-middle inter">
                <td>{driver.id}</td>
                <td>
                  {driver.firstName} {driver.lastName}
                </td>
                <td>{driver.available ? "Dostępny" : "W trakcie jazdy"}</td>
                <td>
                  <button
                    className="custom-edit-btn"
                    onClick={() =>
                      navigate(`/kierowcy/edytuj`, { state: { driver } })
                    }
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="custom-toggle-btn"
                    onClick={() => toggleRow(driver.id)}
                    aria-expanded={!!expandedRows[driver.id]}
                  >
                    <i
                      className={`bi ${
                        expandedRows[driver.id]
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                    ></i>
                  </button>
                </td>
              </tr>

              {expandedRows[driver.id] && (
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
                              <strong>Adres email:</strong>{" "}
                              {driver.email || "Brak danych"}
                            </p>
                            <p>
                              <strong>Tel. kontaktowy:</strong>{" "}
                              {driver.phoneNumber || "Brak danych"}
                            </p>
                          </div>
                          <div className="col-md-6 inter">
                            <p>
                              <strong>Czas pracy w akt. miesiącu:</strong>{" "}
                              {workingHours[driver.id]?.general ||
                                "Ładowanie..."}
                            </p>
                            <div>
                              {workingHours[driver.id]?.limits ? (
                                <div>
                                  {Object.entries(
                                    workingHours[driver.id]?.limits
                                  ).map(([period, time]) => (
                                    <p key={period}>
                                      <strong>{period}:</strong> {time}
                                    </p>
                                  ))}
                                </div>
                              ) : (
                                <p>Ładowanie danych...</p>
                              )}
                            </div>
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
    </>
  );
};

export default DriversTable;
