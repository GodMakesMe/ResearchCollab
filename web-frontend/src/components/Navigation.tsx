import React, { useState } from 'react'; // Import useState
import { Link, useLocation } from 'react-router-dom';
import NotificationManager from './NotificationManager'; // Adjust path if needed

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-purple-800' : 'text-gray-600';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu when a link is clicked (optional but good UX)
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-purple-800" onClick={handleMobileLinkClick}>
            Research<span className="text-purple-500">Collab</span>
          </Link>
        </div>

        {/* Desktop Menu Links (Hidden on small screens) */}
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

        {/* Right Side Icons (Notifications, Profile) */}
        <div className="flex items-center space-x-4">
          <NotificationManager />
          <Link to="/profile" className={`bg-purple-100 p-2 rounded-full hover:ring-2 ring-purple-300 transition ${isActive('/profile')}`}>
            {/* Placeholder Initials - Replace with dynamic data later */}
            <span className="text-purple-800 font-medium text-sm">JP</span>
          </Link>

          {/* Mobile Menu Button (Hidden on medium screens and up) */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-purple-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            aria-label="Open main menu"
            aria-expanded={isMobileMenuOpen}
          >
            {/* Hamburger Icon */}
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                // Close Icon (X)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                // Hamburger Icon (bars)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Conditionally Rendered) */}
      {/* Use Tailwind classes for transition/animation if desired */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          {/* Mobile Menu Links */}
          <Link
            to="/"
            onClick={handleMobileLinkClick} // Close menu on click
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') === 'text-purple-800' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'}`}
          >
            Home
          </Link>
          <Link
            to="/projects"
            onClick={handleMobileLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/projects') === 'text-purple-800' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'}`}
          >
            Projects
          </Link>
          <Link
            to="/dashboard"
            onClick={handleMobileLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard') === 'text-purple-800' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'}`}
          >
            Dashboard
          </Link>
           <Link
             to="/teams"
             onClick={handleMobileLinkClick}
             className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/teams') === 'text-purple-800' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'}`}
          >
            Teams
          </Link>
          <Link
            to="/resources"
            onClick={handleMobileLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/resources') === 'text-purple-800' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'}`}
          >
            Resources
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;