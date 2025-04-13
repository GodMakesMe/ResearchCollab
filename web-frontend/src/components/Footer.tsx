import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
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
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-white">Projects</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-white">Resources</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">Help Center</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">Documentation</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">API</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white">Contact Support</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
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
  );
};

export default Footer; 