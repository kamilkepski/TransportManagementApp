import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Container, Pagination } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [visibleResponses, setVisibleResponses] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [responses, setResponses] = useState({});
  const axiosPrivate = useAxiosPrivate();

  const fetchIssues = async () => {
    try {
      const response = await axiosPrivate.get(
        `/issues?page=${currentPage}&size=5`
      );
      setIssues(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(
        "Błąd podczas pobierania informacji o zgłoszeniach:",
        error
      );
    }
  };

  const toggleResponseForm = (issueId) => {
    setVisibleResponses((prev) => ({
      ...prev,
      [issueId]: !prev[issueId],
    }));
  };

  const handleResponseChange = (issueId, value) => {
    setResponses((prev) => ({ ...prev, [issueId]: value }));
  };

  const handleSendResponse = async (issueId) => {
    const responseText = responses[issueId];
    if (!responseText) {
      alert("Odpowiedź nie może być pusta!");
      return;
    }
    console.log(
      `Wysyłanie odpowiedzi dla zgłoszenia ${issueId}: ${responseText}`
    );
    try {
      await axiosPrivate.post(
        "/issues",
        { issueId, content: responseText },
        { headers: { "Content-Type": "application/json" } }
      );
      setVisibleResponses((prev) => ({
        ...prev,
        [issueId]: false,
      }));
      fetchIssues();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onPageChange = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [currentPage]);

  return (
    <>
      <Navigation />
      <Container className="my-4">
        <div className="rounded-3 my-4">
          <h1 className="syne">Zgłoszenia</h1>
        </div>
        {issues.length === 0 ? (
  <div className="syne h4">
    Brak zgłoszeń do wyświetlenia.
  </div>
) : issues.map((issue) => (
          <>
          <div key={issue.id} className="card mb-3">
            <div className="card-footer bg-dark text-white inter">
              Data otrzymania zgłoszenia:{" "}
              {new Date(issue.submissionDate).toLocaleString("pl-PL")}
            </div>
            <div className="card-body">
              <div className="d-flex flex-nowrap gap-2 justify-content-between">
                <h5 className="card-title text-break fw-bold inter">
                  {issue.driver.firstName} {issue.driver.lastName} (ID{" "}
                  {issue.driver.id})
                </h5>
              </div>
              <p className="card-text inter">{issue.content}</p>
            </div>

            {issue.response && (
              <>
                <div className="existing-response p-3 bg-light border">
                  <h5 className="fw-bold inter">Odpowiedź</h5>
                  <p className="mb-0 inter">{issue.response}</p>
                </div>
                <div className="card-footer bg-dark text-white inter">
                  Data wysłania odpowiedzi:{" "}
                  {new Date(issue.responseDate).toLocaleString("pl-PL")}
                </div>
              </>
            )}

            <div className="p-3">
              <button
                className="custom-toggle-btn syne"
                onClick={() => toggleResponseForm(issue.id)}
              >
                {visibleResponses[issue.id]
                  ? "Anuluj"
                  : issue.response
                  ? "Edytuj odpowiedź"
                  : "Odpowiedz"}
              </button>

              {visibleResponses[issue.id] && (
                <div className="response-form mt-3">
                  <textarea
                    className="form-control mb-2"
                    placeholder="Wpisz swoją odpowiedź..."
                    rows="3"
                    value={responses[issue.id] || ""}
                    onChange={(e) =>
                      handleResponseChange(issue.id, e.target.value)
                    }
                  ></textarea>
                  <button
                    className="custom-btn syne"
                    onClick={() => handleSendResponse(issue.id)}
                  >
                    Wyślij odpowiedź
                  </button>
                </div>
              )}
            </div>
          </div>

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
        ))} 
      </Container>
    </>
  );
};

export default Issues;
