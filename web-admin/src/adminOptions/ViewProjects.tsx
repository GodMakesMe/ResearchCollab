import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backend_url } from '../utils/constants';

interface Project {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: string;
  faculty_id: number;
}

const ViewProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>(''); 
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState<string>(''); 
  const [page, setPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState<number>(1); 
  const limit = 20;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backend_url}/projects`, {
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
        setProjects(response.data.projects);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error('❌ Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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
      <h3 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.5rem', color: '#0f6f6f' }}>
        Registered Projects
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by title"
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
          <div style={{ textAlign: 'center', color: '#999' }}>Loading projects...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f4f7', color: '#0f6f6f' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle} onClick={() => handleSort('project_id')}>Project ID {sortBy === 'project_id' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th style={thStyle} onClick={() => handleSort('title')}>Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle} onClick={() => handleSort('faculty_id')}>Faculty ID {sortBy === 'faculty_id' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.id} style={{
                  borderBottom: '1px solid #eaeaea',
                  backgroundColor: index % 2 === 0 ? '#fafcfc' : '#fff'
                }}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{project.project_id}</td>
                  <td style={tdStyle}>{project.title}</td>
                  <td style={tdStyle}>{project.description}</td>
                  <td style={tdStyle}>{project.status}</td>
                  <td style={tdStyle}>{project.faculty_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
          <span>/ {totalPages}</span>
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
  cursor: 'pointer',
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem',
  color: '#333',
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

export default ViewProjects;
