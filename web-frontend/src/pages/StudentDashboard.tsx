import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const DashboardScreen: React.FC = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const location = useLocation();

  const toggleProject = (title: string) => {
    setExpandedProject((prev) => (prev === title ? null : title));
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-purple-800" : "text-gray-600";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-purple-800">
              Research<span className="text-purple-500">Collab</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${isActive('/')} font-medium hover:text-purple-600`}>
              Home
            </Link>
            <Link to="/projects" className={`${isActive('/projects')} font-medium hover:text-purple-600`}>
              Projects
            </Link>
            <Link to="/dashboard" className={`${isActive('/dashboard')} font-medium hover:text-purple-600`}>
              Dashboard
            </Link>
            <Link to="/teams" className={`${isActive('/teams')} font-medium hover:text-purple-600`}>
              Teams
            </Link>
            <Link to="/resources" className={`${isActive('/resources')} font-medium hover:text-purple-600`}>
              Resources
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="#" className="text-gray-600 hover:text-purple-600">
              <i className="fas fa-bell"></i>
            </Link>
            <Link to="/profile" className={`bg-purple-100 p-2 rounded-full hover:ring-2 ring-purple-300 transition ${isActive('/profile')}`}>
              <span className="text-purple-800 font-medium">JP</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-grow px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, Jane Parker</h2>
        <p className="mb-6">Your Research Dashboard</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: "Total Projects", value: 5 },
            { title: "Active Projects", value: 3 },
            { title: "Total Credits", value: 42 },
          ].map((stat, idx) => (
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
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${proj.progress}%` }}
              ></div>
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
          <div
            key={proj.title}
            className="bg-white p-6 mb-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => toggleProject(proj.title)}
          >
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Research<span className="text-purple-400">Collab</span>
              </h3>
              <p className="text-gray-400">
                Connecting researchers, professors, and students for collaborative research projects.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/projects" className="text-gray-400 hover:text-white">Projects</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-white">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">API</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-github"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
              </div>
              <p className="text-gray-400">Subscribe to our newsletter</p>
              <div className="flex mt-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg w-full text-gray-800"
                />
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Research Collab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardScreen;