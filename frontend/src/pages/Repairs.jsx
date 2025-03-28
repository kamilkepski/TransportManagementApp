import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Pagination } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import RepairsTable from "../components/RepairsTable";
import RepairsReportButton from "../components/RepairsReportButton";

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const axiosPrivate = useAxiosPrivate();

  const fetchRepairs = async (pageNumber = 0) => {
    try {
      const response = await axiosPrivate.get("/repairs", {
        params: {
          page: pageNumber,
          size: pageSize,
        },
      });
      const { content, totalPages } = response.data;
      setRepairs(content);
      setTotalPages(totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error("Błąd podczas pobierania informacji o naprawach:", error);
    }
  };

  useEffect(() => {
    fetchRepairs(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap my-4">
          <h1 className="syne">Naprawy</h1>
          <RepairsReportButton />
        </div>
        <RepairsTable repairs={repairs} />
        <Pagination className="pagination inter">
          <Pagination.Prev
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
          >
            Poprzednia
          </Pagination.Prev>
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === page}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
          >
            Następna
          </Pagination.Next>
        </Pagination>
      </Container>
    </>
  );
};

export default Repairs;
