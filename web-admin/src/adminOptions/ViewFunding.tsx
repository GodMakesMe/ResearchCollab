// src/pages/FundingView.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backend_url } from '../utils/constants';

interface Funding {
  funding_id: number;
  amount: number;
  source: string;
  project_id: number;
  utilization_status: string;
}

const FundingView: React.FC = () => {
  const [fundings, setFundings] = useState<Funding[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Items per page

  const fetchFundings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend_url}/funding`, {
        params: { page, limit },
      });

      setFundings(res.data.fundings);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error('❌ Error fetching funding details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundings();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#0f6f6f'
      }}>
        All Funding Details
      </h3>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        overflowX: 'auto'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#999' }}>Loading funding data...</div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.95rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f4f7', color: '#0f6f6f' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Source</th>
                <th style={thStyle}>Project ID</th>
                <th style={thStyle}>Utilization Status</th>
              </tr>
            </thead>
            <tbody>
              {fundings.map((fund, index) => (
                <tr key={fund.funding_id} style={{
                  borderBottom: '1px solid #eaeaea',
                  backgroundColor: index % 2 === 0 ? '#fafcfc' : '#fff'
                }}>
                  <td style={tdStyle}>{(page - 1) * limit + index + 1}</td>
                  <td style={tdStyle}>{fund.funding_id}</td>
                  <td style={tdStyle}>{fund.amount}</td>
                  <td style={tdStyle}>{fund.source}</td>
                  <td style={tdStyle}>{fund.project_id}</td>
                  <td style={tdStyle}>{fund.utilization_status}</td>
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

        <div style={{ marginTop: '1rem' }}>
          <input
            type="number"
            value={page}
            min={1}
            max={totalPages}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val >= 1 && val <= totalPages) {
                setPage(val);
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

export default FundingView;
