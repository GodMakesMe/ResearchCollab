import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../utils/constants"; // Adjust the import path as necessary

const departments = ["All Departments", "CSE", "ECE", "Math", "Design"];
const expertiseAreas = [
  "All Expertise Areas",
  "AI",
  "ML",
  "Networks",
  "Databases",
  "UI/UX",
];

const FacultyQueryForm = () => {
  const [department, setDepartment] = useState("All Departments");
  const [expertise, setExpertise] = useState("All Expertise Areas");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleQuery = async () => {
    setLoading(true);
    setResults([]);

    const queryParams = new URLSearchParams();
    if (department !== "All Departments") queryParams.append("department", department);
    if (expertise !== "All Expertise Areas") queryParams.append("expertise", expertise);
    queryParams.append("sortBy", sortBy);
    queryParams.append("sortOrder", sortOrder);
    queryParams.append("page", String(page));
    queryParams.append("pageSize", String(pageSize));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(backend_url + '/faculty-expertise', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: queryParams,
      });

      setResults(response.data.data);
      setTotalPages(response.data.pagination.totalPages);

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      handleQuery();
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      handleQuery();
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPage = Number(e.target.value);
    if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= totalPages) {
      setPage(inputPage);
      handleQuery();
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1.5rem', color: '#0f6f6f' }}>
        Faculty Members and Their Expertise Areas
      </h3>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', padding: '2rem', maxWidth: '700px', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: '#333' }}>
            Filter by Department (Optional)
          </label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} style={selectStyle}>
            {departments.map((dept) => (<option key={dept}>{dept}</option>))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: '#333' }}>
            Filter by Expertise Area (Optional)
          </label>
          <select value={expertise} onChange={(e) => setExpertise(e.target.value)} style={selectStyle}>
            {expertiseAreas.map((area) => (<option key={area}>{area}</option>))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: '#333' }}>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
            <option value="name">Name</option>
            <option value="department">Department</option>
            <option value="expertise">Expertise</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: '#333' }}>Sort Order</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={selectStyle}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: '#333' }}>Page Size</label>
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} style={selectStyle}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <button onClick={handleQuery} style={{ backgroundColor: '#0f6f6f', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Loading...' : 'Execute Query'}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', maxWidth: '700px', color: '#555' }}>
        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.75rem' }}>Results</h4>
        {results.length === 0 ? (
          <p>Query results will appear here.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Department</th>
                <th style={thStyle}>Expertise</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{row.faculty_name}</td>
                  <td style={tdStyle}>{row.department}</td>
                  <td style={tdStyle}>{row.expertise}</td>
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
            onChange={handlePageInputChange}
            style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc', width: '80px', marginRight: '0.5rem' }}
          />
          <span> / {totalPages}</span>
        </div>
      </div>
    </div>
  );
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  padding: '0.8rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
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

const thStyle: React.CSSProperties = {
  borderBottom: '1px solid #ccc',
  textAlign: 'left',
  padding: '0.5rem'
};

const tdStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderBottom: '1px solid #eee'
};

export default FacultyQueryForm;
