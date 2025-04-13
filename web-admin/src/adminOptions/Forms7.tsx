import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../../src/utils/constants"; // update if needed

const ExpertiseCountByStudentForm: React.FC = () => {
  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const handleQuery = async (newPage = page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found.");
        return;
      }

      const response = await axios.get(`${backend_url}/query/query7`, {
        headers: { Authorization: token },
        params: { page: newPage, limit }
      });

      setResult(response.data);
      setPage(newPage);
    } catch (error) {
      console.error("Error fetching query 7:", error);
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#0f6f6f'
      }}>
        Count of Expertise Assigned to Each Student
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
          onClick={() => handleQuery()}
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
        ) : result && result.length > 0 ? (
          <>
            <ul>
              {result.map((row, idx) => (
                <li key={idx}>
                  <strong>{row.student_name}</strong>: {row.expertise_count} expertise
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => handleQuery(page - 1)}
                disabled={page === 1}
                style={{ marginRight: '1rem' }}
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                onClick={() => handleQuery(page + 1)}
                style={{ marginLeft: '1rem' }}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default ExpertiseCountByStudentForm;
