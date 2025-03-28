import React from "react";

const RoutesTable = () => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <table className="table">
      <thead className="inter">
        <tr>
          <th></th>
          <th>Data</th>
          <th>Nr rejestracyjny</th>
          {auth?.role === "[ROLE_ADMIN]" && <th></th>}
          <th></th>
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <tr className="align-middle inter">
              <td>
                <button
                  className="custom-edit-btn"
                  onClick={() =>
                    navigate(`/trasy/historia/szczegoly`, { state: { order } })
                  }
                >
                  <i className="bi bi-info-circle"></i>
                </button>
              </td>
              <td>
                {order.date
                  ? formatDate(order.date)
                  : `od ${formatDate(order.startDate)} do ${formatDate(
                      order.endDate
                    )}`}
              </td>
              <td>
                {order.vehicleAssignments[0]?.vehicle?.registrationNumber}
              </td>
              {auth?.role === "[ROLE_ADMIN]" && (
                <td>
                  <button
                    className="custom-edit-btn"
                    onClick={() =>
                      navigate(`/zlecenia/edytuj`, { state: { order } })
                    }
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </td>
              )}
              <td>
                <button
                  className="custom-toggle-btn"
                  onClick={() => toggleRow(order.id)}
                  aria-expanded={!!expandedRows[order.id]}
                >
                  <i
                    className={`bi ${
                      expandedRows[order.id]
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                  ></i>
                </button>
              </td>
            </tr>

            {expandedRows[order.id] && (
              <tr>
                <td colSpan="5" className="p-0">
                  <div className="card border-0 m-3">
                    <div className="card-body">
                      <h5 className="card-title fw-bold inter">
                        Podstawowe informacje
                      </h5>
                      <div className="row">
                        <div className="col-md-6 inter">
                          <p>
                            <strong>Zamawiający:</strong>{" "}
                            {order.name || "Brak danych"}
                          </p>
                          <p>
                            <strong>Tel. kontaktowy:</strong>{" "}
                            {order.phoneNumber || "Brak danych"}
                          </p>
                          <p>
                            <strong>Liczba pasażerów:</strong>{" "}
                            {order.numberOfPassengers || "Brak danych"}
                          </p>
                        </div>
                        <div className="col-md-6 inter">
                          <p>
                            <strong>Skąd?:</strong>{" "}
                            {order.startPoint || "Brak danych"}
                          </p>
                          <p>
                            <strong>Dokąd?:</strong>{" "}
                            {order.destination || "Brak danych"}
                          </p>
                          <p>
                            <strong>Godzina podstawienia:</strong>{" "}
                            {order.time?.slice(0, 5) || "Brak danych"}
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
  );
};

export default RoutesTable;
