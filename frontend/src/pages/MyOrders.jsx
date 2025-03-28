import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Pagination } from "react-bootstrap";
import OrdersTable from "../components/OrdersTable";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axiosPrivate.get(`/orders/driver/pageable`, {
          params: { page: currentPage, size: 5 },
        });
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error(
          "Error fetching orders:",
          err.response?.data || err.message
        );
      }
    };

    getOrders();
  }, [currentPage, axiosPrivate]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="rounded-3 my-4">
          <h1 className="syne">Moje zlecenia</h1>
        </div>
        <OrdersTable orders={orders} />

        <Pagination className="pagination inter">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Poprzednia
          </Pagination.Prev>

          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index}
              active={index === currentPage}
              onClick={() => handlePageChange(index)}
            >
              {index + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            Następna
          </Pagination.Next>
        </Pagination>
      </Container>
    </>
  );
};

export default MyOrders;
