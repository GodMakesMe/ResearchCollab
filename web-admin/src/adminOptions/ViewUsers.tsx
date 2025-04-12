import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
}

const ViewUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>(''); // For search input
  const [page, setPage] = useState<number>(1); // For pagination
  const [totalPages, setTotalPages] = useState<number>(1); // Total number of pages

  const limit = 20; // Number of items per page

  // Fetch users whenever the page or search query changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://researchcollab-backend.up.railway.app/users', {
          headers: {
            'Authorization': `${token}`,
          },
          params: {
            search,
            page,
            limit,
          },
        });
        console.log('✅ Users fetched:', response.data);
        setUsers(response.data.users); // Assuming response.data.users holds the list of users
        setTotalPages(response.data.pagination.totalPages); // Assuming pagination data is returned
      } catch (error) {
        console.error('❌ Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [search, page]); // Run again when search or page changes

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page when a new search is entered
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
        Registered Users
      </h3>

      <div style={{
        marginBottom: '1rem',
      }}>
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

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        overflowX: 'auto'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#999' }}>Loading users...</div>
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
                <th style={thStyle}>Password</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
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
                  <td style={tdStyle}>{user.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      	{/* Pagination Controls */}
		<div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
		<button
			onClick={handlePrevPage}
			disabled={page === 1}
			style={buttonStyle}
		>
			Previous
		</button>

		<button
			onClick={handleNextPage}
			disabled={page === totalPages}
			style={buttonStyle}
		>
			Next
		</button>

		{/* Manual Page Input */}
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
  borderBottom: '1px solid #ddd'
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

export default ViewUsers;

