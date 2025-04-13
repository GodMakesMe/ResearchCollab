import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../utils/constants"; // Ensure this URL is correct

interface QueryBoxProps {
  title: string;
  description?: string;
  buttonText: string;
  onClick: () => void;
  result: string | null;
}

const QueryBox: React.FC<QueryBoxProps> = ({
  title,
  description,
  buttonText,
  onClick,
  result,
}) => {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", marginBottom: "3rem" }}>
      <h3 style={{ fontSize: "1.8rem", fontWeight: 600, color: "#0f6f6f" }}>
        {title}
      </h3>
      {description && (
        <p style={{ marginBottom: "1rem", color: "#666" }}>{description}</p>
      )}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          padding: "2rem",
          maxWidth: "700px",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={onClick}
          style={{
            backgroundColor: "#0f6f6f",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          {buttonText}
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "1.5rem",
          borderRadius: "12px",
          maxWidth: "700px",
          color: "#555",
        }}
      >
        <h4
          style={{
            fontSize: "1.2rem",
            fontWeight: "600",
            marginBottom: "0.75rem",
          }}
        >
          Results
        </h4>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {result ?? "Query results will appear here."}
        </pre>
      </div>
    </div>
  );
};

const FacultyExpertiseQuery = () => {
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Check if the token exists before making the request
      if (!token) {
        setResults("Error: No token found.");
        return;
      }

      const response = await axios.get(`${backend_url}/query/query2`, {
        headers: {
          'Authorization': `${token}`,
        },
      });

      // Handle the response data, formatting it into a readable string
      const formatted = response.data
        .map((row: any) => `${row.faculty_name} (Expertise Count: ${row.expertise_count})`)
        .join("\n");

      // Display formatted results
      setResults(formatted || "No results found.");
    } catch (error: any) {
        console.error("❌ Error fetching data:", error);
      // Enhanced error handling
      if (axios.isAxiosError(error)) {
        setResults(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        setResults(`Unexpected Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <QueryBox
      title="Faculty with Multiple Expertise Areas"
      description="This query finds faculty members who have more than one area of expertise."
      buttonText={loading ? "Loading..." : "Execute Query"}
      onClick={handleQuery}
      result={results}
    />
  );
};

export default FacultyExpertiseQuery;
