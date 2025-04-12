import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

const ViewFaculty: React.FC = () => {
  const [faculty, setFaculty] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/faculty')
      .then(response => {
        setFaculty(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching faculty:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#0f6f6f'
      }}>
        Registered Faculty
      </h3>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        overflowX: 'auto'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#999' }}>Loading faculty...</div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.95rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f4f7', color: '#0f6f6f' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Joined At</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((user, index) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: '1px solid #eaeaea',
                    backgroundColor: index % 2 === 0 ? '#fafcfc' : '#fff'
                  }}
                >
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>{user.role}</td>
                  <td style={tdStyle}>{new Date(user.joinedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem',
  fontWeight: 600,
  borderBottom: '1px solid #ddd'
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem',
  color: '#333'
};

export default ViewFaculty;
