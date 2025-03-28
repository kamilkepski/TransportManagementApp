import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Pagination, Dropdown } from "react-bootstrap";
import AddAnnouncement from "../components/AddAnnouncement";
import DeleteAnnouncement from "../components/DeleteAnnouncement";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const Announcements = () => {
  const { auth } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState("created");
  const [sortOrder, setSortOrder] = useState("DESC");
  const pageSize = 5;
  const axiosPrivate = useAxiosPrivate();

  const fetchAnnouncements = async (pageNumber = 0) => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get("/announcements", {
        params: {
          page: pageNumber,
          size: pageSize,
          sort: `${sortField},${sortOrder}`,
        },
      });
      const { content, totalPages } = response.data;
      setAnnouncements(content);
      setTotalPages(totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error(
        "Błąd przy pobieraniu ogłoszeń:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(page);
  }, [page, sortField, sortOrder]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setPage(0);
  };

  const handleAddAnnouncement = () => {
    fetchAnnouncements(0);
  };

  const handleDeleteAnnouncement = () => {
    const newPage = page > 0 && announcements.length === 1 ? page - 1 : page;
    fetchAnnouncements(newPage);
  };

  return (
    <>
      <Navigation />
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4 my-4 flex-wrap">
          <h1 className="syne">Komunikaty</h1>
          <div className="d-flex">
            {auth?.role === "[ROLE_ADMIN]" && (
              <AddAnnouncement onSubmit={handleAddAnnouncement} />
            )}

            <Dropdown className="syne ms-2">
              <Dropdown.Toggle as="button" className="custom-btn">
                Sortuj według
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => handleSortChange("created", "DESC")}
                >
                  Data dodania (najnowsze)
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleSortChange("created", "ASC")}
                >
                  Data dodania (najstarsze)
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {isLoading ? (
          <p>Ładowanie komunikatów...</p>
        ) : (
          <>
            {announcements.map((announcement) => (
              <div key={announcement.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex flex-nowrap gap-2 justify-content-between">
                    <h5 className="card-title text-break fw-bold inter">
                      {announcement.title}
                    </h5>
                    {auth?.role === "[ROLE_ADMIN]" && (
                      <DeleteAnnouncement
                        announcementId={announcement.id}
                        onDelete={handleDeleteAnnouncement}
                      />
                    )}
                  </div>
                  <p className="card-text inter">{announcement.description}</p>
                </div>
                <div className="card-footer bg-dark text-white inter">
                  Data dodania:{" "}
                  {new Date(announcement.created).toLocaleString("pl-PL")}
                </div>
              </div>
            ))}

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
          </>
        )}
      </Container>
    </>
  );
};

export default Announcements;
