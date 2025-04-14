import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backend_url } from '../utils/constants';

interface Faculty {
  faculty_id: number;
  name: string;
  email: string;
  department: string;
  phone: string;
}

const EditFaculty: React.FC = () => {
  const [faculty, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const limit = 20;

  useEffect(() => {
    const fetchFaculties = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(backend_url + '/faculty', {
          headers: { Authorization: `${token}` },
          params: { search, page, limit, sortBy, sortOrder },
        });
        setFaculties(response.data.faculty);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error('❌ Error fetching faculty:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, [search, page, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleInputChange = (index: number, field: keyof Faculty, value: string) => {
    const updatedFaculties = [...faculty];
    (updatedFaculties[index] as any)[field] = value;
    setFaculties(updatedFaculties);
  };

  const handleEditSubmit = async (faculty: Faculty) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${backend_url}/faculty/${faculty.faculty_id}`, faculty, {
        headers: { Authorization: `${token}` },
      });
      alert(`✔ Faculty ${faculty.faculty_id} updated`);
    } catch (error) {
      console.error('Error updating faculty:', error);
    }
  };

  const handleDelete = async (faculty_id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backend_url}/faculty/${faculty_id}`, {
        headers: { Authorization: `${token}` },
      });
      setFaculties(faculty.filter((faculty) => faculty.faculty_id !== faculty_id));
      alert(`🗑️ Faculty ${faculty_id} deleted`);
    } catch (error) {
      console.error('Error deleting faculty:', error);
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
      <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1.5rem', color: '#0f6f6f' }}>
        Edit Faculty
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or email"
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

      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', padding: '2rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#999' }}>Loading faculty data...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f4f7', color: '#0f6f6f' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle} onClick={() => handleSort('faculty_id')}>faculty id {sortBy === 'faculty_id' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th style={thStyle} onClick={() => handleSort('name')}>Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th style={thStyle} onClick={() => handleSort('email')}>Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th style={thStyle} onClick={() => handleSort('department')}>Department {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th style={thStyle} onClick={() => handleSort('phone')}>Phone {sortBy === 'phone' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th style={thStyle}>✔</th>
                <th style={thStyle}>🗑️</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((faculty, index) => (
                <tr key={faculty.faculty_id} style={{ borderBottom: '1px solid #eaeaea', backgroundColor: index % 2 === 0 ? '#fafcfc' : '#fff' }}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{faculty.faculty_id}</td>
                  <td style={tdStyle}>
                    <input value={faculty.name} onChange={(e) => handleInputChange(index, 'name', e.target.value)} style={inputStyle} />
                  </td>
                  <td style={tdStyle}>
                    <input value={faculty.email} onChange={(e) => handleInputChange(index, 'email', e.target.value)} style={inputStyle} />
                  </td>
                  <td style={tdStyle}>
                    <input value={faculty.department} onChange={(e) => handleInputChange(index, 'department', e.target.value)} style={inputStyle} />
                  </td>
                  <td style={tdStyle}>
                    <input value={faculty.phone} onChange={(e) => handleInputChange(index, 'phone', e.target.value)} style={inputStyle} />
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleEditSubmit(faculty)} style={iconButtonStyle}>✔</button>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDelete(faculty.faculty_id)} style={iconButtonStyle}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button onClick={handlePrevPage} disabled={page === 1} style={buttonStyle}>Previous</button>
        <button onClick={handleNextPage} disabled={page === totalPages} style={buttonStyle}>Next</button>
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
            style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc', width: '80px', marginRight: '0.5rem' }}
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

const inputStyle: React.CSSProperties = {
  padding: '0.4rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '100%'
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

const iconButtonStyle: React.CSSProperties = {
  padding: '0.3rem 0.6rem',
  backgroundColor: '#0f6f6f',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
};

export default EditFaculty;