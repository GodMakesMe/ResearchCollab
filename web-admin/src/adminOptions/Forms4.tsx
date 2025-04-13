import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../utils/constants";

const StudentDetailsQuery = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("student_id");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found.");
        return;
      }

      const response = await axios.get(`${backend_url}/students`, {
        headers: { Authorization: token },
        params: {
          page,
          limit: 5,
          search,
          sortBy,
          sortOrder
        }
      });

      setStudents(response.data.students);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, [page, search, sortBy, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", maxWidth: "700px", margin: "auto" }}>
      <h3 style={{ fontSize: "1.8rem", fontWeight: 600, color: "#0f6f6f" }}>
        Student Details
      </h3>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by program or year"
          value={search}
          onChange={handleSearch}
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "100%"
          }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={toggleSortOrder}
          style={{
            backgroundColor: "#0f6f6f",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Toggle Sort Order ({sortOrder.toUpperCase()})
        </button>
      </div>

      <div style={{ backgroundColor: "#f9f9f9", padding: "1rem", borderRadius: "12px" }}>
        {loading ? (
          <p>Loading...</p>
        ) : students.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul>
            {students.map((student: any) => (
              <li key={student.student_id} style={{ marginBottom: "0.75rem" }}>
                <strong>{student.student_id}</strong> ({student.program}, {student.enrollment_year})<br />
                <span style={{ color: "#0077cc" }}>User ID: {student.user_id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage(prev => prev - 1)}
          style={{ padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(prev => prev + 1)}
          style={{ padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentDetailsQuery;
