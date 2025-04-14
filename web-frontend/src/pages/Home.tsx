import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  // const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Token not found, redirecting to login...');
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <div className="bg-gray-50 font-sans">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Streamline Your Research Project Management
              </h1>
              <p className="text-xl mb-8">
                A collaborative platform designed to help researchers, professors, and students manage research projects efficiently.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/projects"
                  className="bg-white text-purple-800 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 text-center"
                >
                  Explore Projects
                </Link>
                <Link
                  to="#"
                  className="border border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-200 text-center"
                >
                  Create Project
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img src="/api/placeholder/600/400" alt="Research Collaboration" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Research Collab?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md transition duration-300 feature-card">
              <div className="text-purple-600 text-4xl mb-4">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Relevant Projects</h3>
              <p className="text-gray-600">
                Discover research projects that match your skills, interests, and academic goals with advanced filtering.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transition duration-300 feature-card">
              <div className="text-purple-600 text-4xl mb-4">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-gray-600">
                Connect with professors and students, form research teams, and collaborate effectively in one platform.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transition duration-300 feature-card">
              <div className="text-purple-600 text-4xl mb-4">
                <i className="fas fa-tasks"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Project Management</h3>
              <p className="text-gray-600">
                Track progress, manage tasks, and achieve research milestones with intuitive project management tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-purple-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="text-4xl font-bold text-purple-800 mb-2">500+</h3>
              <p className="text-gray-600">Active Projects</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-purple-800 mb-2">150+</h3>
              <p className="text-gray-600">Professors</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-purple-800 mb-2">2,500+</h3>
              <p className="text-gray-600">Students</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-purple-800 mb-2">12</h3>
              <p className="text-gray-600">Research Domains</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Recent Projects</h2>
            <Link to="/projects" className="text-purple-600 font-medium hover:text-purple-800 flex items-center">
              View All Projects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project cards would be rendered here */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Research Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Research Collab today and connect with leading professors, innovative projects, and passionate researchers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="#" className="bg-white text-purple-800 font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-200">
              Sign Up
            </Link>
            <Link to="/projects" className="border border-white text-white font-medium px-8 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-200">
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home; 