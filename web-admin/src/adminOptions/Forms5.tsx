import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../utils/constants";
import { ClipLoader } from 'react-spinners';

const MoreThanXExpertiseStudentsForm = () => {
  const [minExpertise, setMinExpertise] = useState(1);
  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    const pageSize = 10; // Set a default value for pageSize
    setLoading(true);
    try {
      const page = 1; // Initialize page with a default value
      const response = await axios.get(`${backend_url}/query/query5`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
        params: {
          page,
          pageSize,
          minExpertise,
        },
      });
      setResult(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
        Students with More Than X Expertise Areas
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
          Minimum Expertise Areas:
        </label>
        <input
          type="number"
          value={minExpertise}
          onChange={(e) => setMinExpertise(parseInt(e.target.value))}
          style={{
            padding: '0.6rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            width: '100px',
            marginBottom: '1.5rem'
          }}
          min={1}
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
          <ClipLoader color="#0f6f6f" loading={loading} size={50} />
        ) : result === null ? (
          <p>Query results will appear here.</p>
        ) : result.length === 0 ? (
          <p>No faculty found with more than {minExpertise} expertise area(s).</p>
        ) : (
            <ul>
            {result.map((faculty, index) => (
              <li key={index}>
                <strong>{faculty.student_name}</strong> – {faculty.expertise_list.join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MoreThanXExpertiseStudentsForm;
