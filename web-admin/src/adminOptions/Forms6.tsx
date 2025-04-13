import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../utils/constants";

const StudentsExpertiseListForm: React.FC = () => {
    const [result, setResult] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10;
  
    const handleQuery = async (newPage = page) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Token not found.");
          return;
        }
  
        const response = await axios.get(`${backend_url}/query/query6`, {
          headers: { Authorization: token },
          params: { page: newPage, limit }
        });
  
        setResult(response.data);
        setPage(newPage);
      } catch (error) {
        console.error("Error fetching data:", error);
        setResult([]);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* ... title and button ... */}
        <button onClick={() => handleQuery()}>Execute Query</button>
  
        {/* Results */}
        <div>
          {loading ? <p>Loading...</p> :
            result?.length ? (
              <>
                <ul>
                  {result.map((row, idx) => (
                    <li key={idx}><strong>{row.student_name}</strong> – {row.expertise}</li>
                  ))}
                </ul>
  
                <div style={{ marginTop: '1rem' }}>
                  <button disabled={page === 1} onClick={() => handleQuery(page - 1)}>Previous</button>
                  <span style={{ margin: '0 1rem' }}>Page {page}</span>
                  <button onClick={() => handleQuery(page + 1)}>Next</button>
                </div>
              </>
            ) : <p>No data found.</p>
          }
        </div>
      </div>
    );
  };
  

export default StudentsExpertiseListForm;
