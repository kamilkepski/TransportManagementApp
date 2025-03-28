import { useState, useEffect, useRef } from "react";
import { Container, ButtonGroup, Pagination } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navigation from "../components/Navigation";
import OrdersTable from "../components/OrdersTable";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const axiosPrivate = useAxiosPrivate();
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef(null);

  const fetchOrders = async (value, immediate = false) => {
    try {
      const isIdSearch = !!value;
      setIsSearching(isIdSearch);

      const params = isIdSearch
        ? { id: value }
        : {
            page,
            size: pageSize,
            ...(statusFilter !== "all" && { status: statusFilter }),
          };

      if (isIdSearch && !immediate) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(async () => {
          const response = await axiosPrivate.get("/orders", { params });
          setOrders(response.data ? [response.data] : []);
          setTotalPages(1);
        }, 500);
      } else {
        const response = await axiosPrivate.get("/orders", { params });
        if (isIdSearch) {
          setOrders(response.data ? [response.data] : []);
          setTotalPages(1);
        } else {
          setOrders(response.data.content);
          setTotalPages(response.data.totalPages);
        }
      }
    } catch (err) {
      console.error(
        "Error fetching orders:",
        err.response?.data || err.message
      );
      setOrders([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchOrders(searchId);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchId]);

  useEffect(() => {
    if (!isSearching) {
      fetchOrders("", true);
    }
  }, [statusFilter, page, pageSize]);

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchId(value);
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="rounded-3 my-4">
          <h1 className="syne">Lista zleceń</h1>
        </div>

        <div className="d-flex justify-content-between flex-wrap">
          <ButtonGroup className="mb-3 inter">
            <button
              className={`btn ${
                statusFilter === "all" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => !isSearching && setStatusFilter("all")}
              disabled={isSearching}
            >
              Wszystkie
            </button>
            <button
              className={`btn ${
                statusFilter === "W_TRAKCIE_REALIZACJI"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={() =>
                !isSearching && setStatusFilter("W_TRAKCIE_REALIZACJI")
              }
              disabled={isSearching}
            >
              W realizacji
            </button>
            <button
              className={`btn ${
                statusFilter === "PRZYJETE"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={() => !isSearching && setStatusFilter("PRZYJETE")}
              disabled={isSearching}
            >
              Przyjęte
            </button>
            <button
              className={`btn ${
                statusFilter === "ZAKONCZONE"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={() => !isSearching && setStatusFilter("ZAKONCZONE")}
              disabled={isSearching}
            >
              Zakończone
            </button>
          </ButtonGroup>
          <div className="d-flex align-items-center inter mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Wprowadź ID zlecenia"
              value={searchId}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {orders.length > 0 ? (
          <>
            <OrdersTable orders={orders} />
            {!isSearching && (
              <Pagination className="pagination inter">
                <Pagination.Prev
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  Poprzednia
                </Pagination.Prev>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index === page}
                    onClick={() => setPage(index)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                >
                  Następna
                </Pagination.Next>
              </Pagination>
            )}
          </>
        ) : (
          <p className="inter">Brak zleceń w wybranej kategorii.</p>
        )}
      </Container>
    </>
  );
};

export default Orders;
