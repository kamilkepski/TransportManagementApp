import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DriversTable from "../components/DriversTable";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  const fetchDrivers = async (page = 0) => {
    try {
      const response = await axiosPrivate.get(`/drivers`, {
        params: { page, size: 5 },
      });
      setDrivers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Błąd podczas pobierania informacji o pojazdach:", error);
    }
  };

  useEffect(() => {
    fetchDrivers(currentPage);
  }, [currentPage]);

  return (
    <>
      <Navigation />
      <Container>
        <div className="rounded-3 my-4">
          <h1 className="syne">Lista kierowców</h1>
        </div>
        <DriversTable
          drivers={drivers}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Container>
    </>
  );
};

export default Drivers;
