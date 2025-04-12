import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backend_url, local_backend_url } from '../utils/constants';

interface Faculty {
  faculty_id: number;
  user_id: number;
  name: string;
  email: string;
  department: string;
  phone: string;
}

const ViewFaculty: React.FC = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const limit = 20;

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${local_backend_url}/faculty`, {
          headers: {
            Authorization: `${token}`,
          },
          params: {
            search,
            page,
            limit,
            sortBy,
            sortOrder,
          },
        });

        setFaculty(response.data.faculty);
        console.log('📦 Faculty Response:', response.data.faculty);
        setTotalPages(response.data.pagination.totalPages);
        
      } catch (error) {

        console.error('❌ Error fetching faculty:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [search, page, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#0f6f6f'
      }}>
        Faculty List
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name, email or department"
          style={{
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            width: '100%',
            maxWidth: '400px',
            marginBottom: '1rem',
          }}
        />
      </div>

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
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f4f7', color: '#0f6f6f' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle} onClick={() => handleSort('faculty_id')}>
                  Faculty ID {sortBy === 'faculty_id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={thStyle} onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={thStyle} onClick={() => handleSort('email')}>
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={thStyle} onClick={() => handleSort('department')}>
                  Department {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={thStyle} onClick={() => handleSort('phone')}>
                  Phone {sortBy === 'phone' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f, index) => (
                <tr key={f.faculty_id} style={{
                  borderBottom: '1px solid #eaeaea',
                  backgroundColor: index % 2 === 0 ? '#fafcfc' : '#fff'
                }}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{f.faculty_id}</td>
                  <td style={tdStyle}>{f.name}</td>
                  <td style={tdStyle}>{f.email}</td>
                  <td style={tdStyle}>{f.department}</td>
                  <td style={tdStyle}>{f.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button onClick={handlePrevPage} disabled={page === 1} style={buttonStyle}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={page === totalPages} style={buttonStyle}>
          Next
        </button>

        <div style={{ marginTop: '1rem' }}>
          <input
            type="number"
            value={page}
            min={1}
            max={totalPages}
            onChange={(e) => {
              const inputPage = Number(e.target.value);
              if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= totalPages) {
                setPage(inputPage);
              }
            }}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '80px',
              marginRight: '0.5rem',
            }}
          />
          <span> / {totalPages}</span>
        </div>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem',
  fontWeight: 600,
  borderBottom: '1px solid #ddd',
  cursor: 'pointer'
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem',
  color: '#333'
};

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#0f6f6f',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1rem',
  margin: '0 0.5rem',
};

export default ViewFaculty;
