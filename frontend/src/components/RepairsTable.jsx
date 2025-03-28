import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RepairsTable = ({ repairs }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDescription = (description) => {
    return description
      ? description.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))
      : "Brak danych";
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead className="inter">
          <tr>
            <th>Numer rejestracyjny</th>
            <th>Tytuł</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {repairs.map((repair) => (
            <React.Fragment key={repair.id}>
              <tr className="align-middle inter">
                <td>{repair.vehicle.registrationNumber}</td>
                <td>{repair.title}</td>
                <td>
                  <button
                    className="custom-edit-btn"
                    onClick={() =>
                      navigate(`/naprawy/edytuj`, { state: { repair } })
                    }
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="custom-toggle-btn"
                    onClick={() => toggleRow(repair.id)}
                    aria-expanded={!!expandedRows[repair.id]}
                  >
                    <i
                      className={`bi ${
                        expandedRows[repair.id]
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                    ></i>
                  </button>
                </td>
              </tr>

              {expandedRows[repair.id] && (
                <tr>
                  <td colSpan="5" className="p-0">
                    <div className="card border-0 m-3">
                      <div className="card-body">
                        <h5 className="card-title fw-bold inter">
                          Opis naprawy
                        </h5>
                        <div className="row">
                          <div className="col inter">
                            {repair.repairDate && <p>Data naprawy: {new Date(repair.repairDate).toISOString().split("T")[0]}</p>}
                            <p>{formatDescription(repair.description)}</p>
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
    </div>
  );
};

export default RepairsTable;
