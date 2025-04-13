import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../utils/constants"; // Ensure this is set correctly

const AverageExpertisePerFacultyForm: React.FC = () => {
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // You can adjust page size here

  const handleQuery = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found.");
        return;
      }

      const response = await axios.get(`${backend_url}/query/query8`, {
        params: { page: currentPage, pageSize },
        headers: {
          'Authorization': `${token}`,
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
        Average Number of Expertise Areas per Faculty Member
      </h3>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        maxWidth: '700px',
        marginBottom: '2rem',
      }}>
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
                <strong>{item.faculty_name}</strong> ({item.department}) – Expertise Count: {item.expertise_count}
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

export default AverageExpertisePerFacultyForm;
