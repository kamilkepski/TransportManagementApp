import React from "react";
import { Pagination } from "react-bootstrap";

const InspectionsTable = ({
  vehicles,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isInspectionValid = (inspectionDate) => {
    if (!inspectionDate) return false;
    const today = new Date();
    const inspection = new Date(inspectionDate);
    return inspection >= today;
  };

  const daysOverdue = (inspectionDate) => {
    if (!inspectionDate) return 0;
    const today = new Date();
    const inspection = new Date(inspectionDate);
    const difference = today - inspection;
    return Math.floor(difference / (1000 * 60 * 60 * 24));
  };

  const daysLeft = (inspectionDate) => {
    if (!inspectionDate) return 0;
    const today = new Date();
    const inspection = new Date(inspectionDate);
    const difference = inspection - today;
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const pluralizeDays = (days) => {
    if (days === 1) return "dzień";
    return "dni";
  };

  return (
    <>
      <table className="table">
        <thead className="inter">
          <tr>
            <th>Numer rejestracyjny</th>
            <th>Marka i model</th>
            <th>Data ważności</th>
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
                <td
                  className={
                    isInspectionValid(vehicle.technicalInspection)
                      ? " text-success"
                      : " text-danger"
                  }
                >
                  {isInspectionValid(vehicle.technicalInspection)
                    ? formatDate(vehicle.technicalInspection)
                    : `${formatDate(
                        vehicle.technicalInspection
                      )} - wykonaj przegląd! (${daysOverdue(
                        vehicle.technicalInspection
                      )} ${pluralizeDays(
                        daysOverdue(vehicle.technicalInspection)
                      )} po terminie)`}
                </td>
              </tr>
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

export default InspectionsTable;
