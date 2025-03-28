import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";
import VehiclesTable from "../components/VehiclesTable";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  const fetchVehicles = async (page = 0) => {
    try {
      const response = await axiosPrivate.get(`/vehicles/pageable`, {
        params: { page, size: 5 },
      });
      setVehicles(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Błąd podczas pobierania informacji o pojazdach:", error);
    }
  };

  useEffect(() => {
    fetchVehicles(currentPage);
  }, [currentPage]);

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="rounded-3 my-4">
          <h1 className="syne">Lista pojazdów</h1>
        </div>
        <VehiclesTable
          vehicles={vehicles}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Container>
    </>
  );
};

export default Vehicles;
