import React from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ReportButton = ({ orderId }) => {
  const axiosPrivate = useAxiosPrivate();

  const downloadReport = async () => {
    let url = null;
    try {
      const response = await axiosPrivate.get("/reports/order", {
        params: { id: orderId },
        responseType: "blob",
      });

      url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report-${orderId}.pdf`);
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Błąd podczas pobierania raportu:", error);
    }
  };

  const handleDownload = () => {
    downloadReport();
  };

  return (
    <button onClick={handleDownload} className="custom-btn syne">
      Pobierz raport PDF
    </button>
  );
};

export default ReportButton;
