import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";
import InspectionsTable from "../components/InspectionsTable";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import InspectionsReportButton from "../components/InspectionsReportButton";

const Inspections = () => {
  const [inspections, setInspections] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const axiosPrivate = useAxiosPrivate();

  const fetchInspections = async (page = 0) => {
    try {
      const response = await axiosPrivate.get("/inspections", {
        params: { page, size: pageSize },
      });
      setInspections(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Błąd podczas pobierania informacji o przeglądach:", error);
    }
  };

  useEffect(() => {
    fetchInspections(currentPage);
  }, [currentPage]);

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap my-4">
          <h1 className="syne">Przeglądy techniczne</h1>
          <InspectionsReportButton />
        </div>
        <InspectionsTable
          vehicles={inspections}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Container>
    </>
  );
};

export default Inspections;
