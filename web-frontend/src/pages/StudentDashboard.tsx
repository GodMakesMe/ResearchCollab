import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";  // Import Navigation component
import Footer from "../components/Footer";          // Import Footer component
import { jwtDecode } from "jwt-decode";               // Import jwt-decode library

interface MyJwtPayload {
  email: string;
  role: 'admin' | 'faculty' | 'student'; // or just `string` if not fixed
  iat: number;
  exp: number;
}

const DashboardScreen: React.FC = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const location = useLocation();
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please log in.");
    window.location.href = "/login";
    return null;
  }

  const decodedToken = jwtDecode<MyJwtPayload>(token.split(' ')[1] || token);
  console.log("Decoded token:", decodedToken);

  // Now TypeScript knows what `.role` is
  if (decodedToken.role === "faculty") {
    // localStorage.removeItem("token");
    window.location.href = "/faculty-dashboard";
    return null;
  }

  const toggleProject = (title: string) => {
    setExpandedProject((prev) => (prev === title ? null : title));
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-purple-800" : "text-gray-600";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Component */}
      <Navigation />

      {/* Dashboard Content */}
      <div className="flex-grow px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, Jane Parker</h2>
        <p className="mb-6">Your Research Dashboard</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[{ title: "Total Projects", value: 5 }, { title: "Active Projects", value: 3 }, { title: "Total Credits", value: 42 }].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-purple-700">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Ongoing Projects */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Ongoing Projects</h3>
        {[{
          title: "Neural Networks for Climate Prediction",
          credits: 15,
          due: "May 20, 2025",
          tags: ["Python", "TensorFlow", "Machine Learning"],
          progress: 50,
        }, {
          title: "Sustainable Energy Solutions",
          credits: 12,
          due: "June 15, 2025",
          tags: ["Engineering", "Renewable"],
          progress: 80,
        }].map((proj, idx) => (
          <div key={idx} className="bg-white p-6 mb-4 rounded-lg shadow-md">
            <div className="text-lg font-semibold text-gray-800">{proj.title}</div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Credits: {proj.credits}</span>
              <span>Due: {proj.due}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {proj.tags.map((tag, i) => (
                <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">{tag}</span>
              ))}
            </div>
            <div className="mt-4 relative h-4 bg-purple-100 rounded-full">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${proj.progress}%` }}></div>
              <span className="absolute right-2 top-[-6px] text-xs text-purple-800 font-semibold">{proj.progress}%</span>
            </div>
          </div>
        ))}

        {/* Completed Projects */}
        <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4">Completed Projects</h3>
        {[{
          title: "Medical Data Analysis",
          credits: 8,
          completed: "Jan 10, 2025",
          tags: ["Biotech", "Data Mining"],
        }, {
          title: "Quantum Computing Basics",
          credits: 7,
          completed: "Feb 28, 2025",
          tags: ["Quantum", "Physics"],
        }].map((proj) => (
          <div key={proj.title} className="bg-white p-6 mb-4 rounded-lg shadow-md cursor-pointer" onClick={() => toggleProject(proj.title)}>
            <div className="text-lg font-semibold text-gray-800">{proj.title}</div>
            {expandedProject === proj.title && (
              <>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Credits: {proj.credits}</span>
                  <span>Completed: {proj.completed}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {proj.tags.map((tag, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default DashboardScreen;
