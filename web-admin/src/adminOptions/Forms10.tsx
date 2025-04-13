import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../utils/constants"; // Ensure this is set correctly

const UsersRolePercentageForm: React.FC = () => {
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found.");
        return;
      }

      const response = await axios.get(`${backend_url}/query/query10`, {
        headers: {
          'Authorization': `${token}`,
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult(null);
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
        Percentage Breakdown of Users by Role
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
        ) : result.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul>
            {result.map((item: any, index: number) => (
              <li key={index}>
                <strong>{item.role}</strong> – {item.percentage}% of users
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UsersRolePercentageForm;
