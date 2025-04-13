import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../utils/constants"; // Ensure this is set correctly

const TopExpertiseAmongStudentsForm: React.FC = () => {
  const [topN, setTopN] = useState(2);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found.");
        return;
      }

      const response = await axios.get(`${backend_url}/query/query9`, {
        params: { page: currentPage, pageSize, topN },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setResult(response.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    handleQuery();
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#0f6f6f'
      }}>
        Top N Common Expertise Among Students
      </h3>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        maxWidth: '700px',
        marginBottom: '2rem',
      }}>
        <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
          Enter how many top expertise areas you want to see:
        </label>
        <input
          type="number"
          value={topN}
          onChange={(e) => setTopN(parseInt(e.target.value))}
          min={1}
          style={{
            padding: '0.6rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            width: '100px',
            marginBottom: '1.5rem'
          }}
        />

        <br />

        <button
          onClick={handleQuery}
          style={{
            backgroundColor: '#0f6f6f',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Execute Query
        </button>
      </div>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '1.5rem',
        borderRadius: '12px',
        maxWidth: '700px',
        color: '#555'
      }}>
        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          Results
        </h4>

        {loading ? (
          <p>Loading...</p>
        ) : result === null ? (
          <p>Query results will appear here.</p>
        ) : result.data.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul>
            {result.data.map((item: any, index: number) => (
              <li key={index}>
                <strong>{item.expertise}</strong> – Number of Students: {item.student_count}
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              marginRight: '0.5rem',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              marginLeft: '0.5rem',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopExpertiseAmongStudentsForm;
