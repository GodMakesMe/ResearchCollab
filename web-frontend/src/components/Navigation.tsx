import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-purple-800' : 'text-gray-600';
  };

  return (
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
          <Link to="#" className="bg-purple-100 p-2 rounded-full">
            <span className="text-purple-800 font-medium">JP</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 