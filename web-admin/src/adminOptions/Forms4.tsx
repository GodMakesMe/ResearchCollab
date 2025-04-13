import React, { useState } from "react";

const StudentDetailsQuery = () => {
  const [showResults, setShowResults] = useState(false);

  const handleQuery = () => {
    setShowResults(true);
  };

  const mockResults = [
    { name: "Ishaan Verma", email: "ishaan@iiitd.ac.in", program: "B.Tech CSE", year: 2020 },
    { name: "Riya Das", email: "riya@iiitd.ac.in", program: "B.Tech ECE", year: 2021 },
    { name: "Tanvi Sharma", email: "tanvi@iiitd.ac.in", program: "B.Tech CSAM", year: 2021 },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#0f6f6f'
      }}>
        Sample Student Details
      </h3>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        maxWidth: '700px',
        marginBottom: '2rem',
      }}>
        <p style={{ marginBottom: '1rem', color: '#555' }}>
          This query lists sample student details including their name, email, program, and enrollment year, sorted by year and name.
        </p>

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

      {/* Results */}
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
        {showResults ? (
          <ul style={{ paddingLeft: '1rem' }}>
            {mockResults.map((student, index) => (
              <li key={index} style={{ marginBottom: '0.75rem' }}>
                <strong>{student.name}</strong> ({student.program}, {student.year})<br />
                <span style={{ color: '#0077cc' }}>{student.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Query results will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDetailsQuery;