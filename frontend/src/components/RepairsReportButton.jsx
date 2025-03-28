import React from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const RepairsReportButton = () => {
  const axiosPrivate = useAxiosPrivate();

  const downloadReport = async () => {
    let url = null;
    try {
      const response = await axiosPrivate.get("/reports/repairs", {
        responseType: "blob",
      });

      url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `raport-naprawy.pdf`);
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

export default RepairsReportButton;
