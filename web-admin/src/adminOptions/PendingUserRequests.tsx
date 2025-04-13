import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backend_url, local_backend_url } from '../utils/constants';

interface RequestType {
  id: number;
  name: string;
  email: string;
  role: string;
}

const PendingRequests: React.FC = () => {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [failedRequests, setFailedRequests] = useState<RequestType[]>([]);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No token found in local storage');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${local_backend_url}/api/registration/pending`, {
        headers: { Authorization: `${token}` },
        params: { page, limit, search },
      });

      setRequests(response.data.requests);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching registration requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, limit, search]);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await axios.post(`${backend_url}/api/registration/approve/${id}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
      }else if (action === 'reject') {
        await axios.delete(`${backend_url}/api/registration/reject/${id}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
      }
      setRequests(prev => prev.filter(req => req.id !== id));
      setSelectedIds(prev => prev.filter(item => item !== id));
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to ${action}`);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    setSelectedIds(requests.map(r => r.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset to page 1 when searching
  };

  const handleRejectSelected = async () => {
    try {
      for (const requestId of selectedIds) {
        await axios.delete(`${backend_url}/api/registration/reject/${requestId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
      }
      // After rejecting, update the state to remove the selected requests
      setRequests(prev => prev.filter(req => !selectedIds.includes(req.id)));
      setSelectedIds([]); // Reset the selected IDs after rejection
      alert('Selected requests have been rejected.');
    } catch (err) {
      console.error('Error rejecting selected requests:', err);
      alert('❌ Failed to reject selected requests.');
    }
  };

  

  const handleApproveSelected = async () => {
    const failedRequestsTemp: RequestType[] = [];
    try {
      for (const requestId of selectedIds) {
        try {
          await axios.post(`${backend_url}/api/registration/approve/${requestId}`, {
            headers: { Authorization: localStorage.getItem('token') },
          });
        } catch (err) {
          console.error(`❌ Failed to approve request ${requestId}:`, err);
          const failedRequest = requests.find(req => req.id === requestId);
          if (failedRequest) {
            failedRequestsTemp.push(failedRequest);
          }
        }
      }
      // Set the failed requests in state
      setFailedRequests(failedRequestsTemp);

      // After approval, update the state to remove the selected requests
      setRequests(prev => prev.filter(req => !selectedIds.includes(req.id)));
      setSelectedIds([]); // Reset the selected IDs after approval

      // Ask the user if they want to delete failed requests
      if (failedRequestsTemp.length > 0) {
        const confirmDelete = window.confirm('There were some failed/invalid/illegal requests. Would you like to delete them?');
        if (confirmDelete) {
          for (const request of failedRequestsTemp) {
            await axios.delete(`${backend_url}/api/registration/reject/${request.id}`, {
              headers: { Authorization: localStorage.getItem('token') },
            });
          }
          // Delete the failed requests from the state
          setFailedRequests([]);
          alert('Failed requests have been deleted.');
        } else {
          alert('Failed requests will not be deleted.');
        }
      } else {
        alert('All selected requests have been approved.');
      }
    } catch (err) {
      console.error('Error approving selected requests:', err);
      alert('❌ Failed to approve selected requests.');
    }
  };

  const filteredRequests = requests.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.role.toLowerCase().includes(search.toLowerCase())
  );


  const handlePreviousPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.5rem', color: '#0f6f6f' }}>
        Pending Registration Requests
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name, email or role"
          style={{
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            width: '100%',
            maxWidth: '400px',
            marginRight: '1rem',
          }}
        />
        <button onClick={handleSelectAll} style={{ ...buttonStyle, backgroundColor: '#0f6f6f' }}>Select All</button>
        <button onClick={handleDeselectAll} style={{ ...buttonStyle, backgroundColor: '#bbb', marginLeft: '0.5rem' }}>Deselect All</button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', padding: '2rem', overflowX: 'auto' }}>
        {requests.length === 0 ? (
          <p>No pending requests found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f4f7', color: '#0f6f6f' }}>
                <th style={thStyle}>Select</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(req.id)}
                      onChange={() => toggleSelect(req.id)}
                    />
                  </td>
                  <td style={tdStyle}>{req.name}</td>
                  <td style={tdStyle}>{req.email}</td>
                  <td style={tdStyle}>{req.role}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleAction(req.id, 'approve')} style={{ ...buttonStyle, backgroundColor: 'green' }}>✔</button>
                    <button onClick={() => handleAction(req.id, 'reject')} style={{ ...buttonStyle, backgroundColor: 'red', marginLeft: '0.5rem' }}>✖</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <button
          onClick={handleRejectSelected}
          style={{
            ...buttonStyle,
            backgroundColor: '#f44336',
            cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
          }}
          disabled={selectedIds.length === 0}
        >
          ✖ Selected
        </button>
        <button
          onClick={handleApproveSelected}
          style={{
            ...buttonStyle,
            backgroundColor: '#4CAF50',
            cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
          }}
          disabled={selectedIds.length === 0}
        >
          y Selected
        </button>
        </div>


        {totalPages > 1 && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              onClick={handlePreviousPage}
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
        )}
        
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem',
  fontWeight: 600,
  borderBottom: '1px solid #ddd',
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



export default PendingRequests;
