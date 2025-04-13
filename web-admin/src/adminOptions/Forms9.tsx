import React, { useState } from "react";

const TopExpertiseAmongStudentsForm: React.FC = () => {
  const [topN, setTopN] = useState(2);
  const [result, setResult] = useState<string | null>(null);

  const handleQuery = () => {
    // setResult(Showing top ${topN} most common expertise areas among students.);
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
        <p>{result ?? "Query results will appear here."}</p>
      </div>
    </div>
  );
};

export default TopExpertiseAmongStudentsForm;