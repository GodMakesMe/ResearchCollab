import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { backend_url } from '../utils/constants';

interface Project {
  id: number;
  title: string;
  description: string;
  domain: string;
  skills: string[];
  professor: string;
  studentsNeeded: number;
  spotsLeft: number;
  postedDate: string;
  availability: 'open' | 'filled';
  professorId: string;
}


const ProjectDetail: React.FC = () => {
  // Grab the project id from the route parameters.
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(''); // Clear previous errors
      const token = localStorage.getItem('token'); // Get token

      // ** Add check for token before fetching **
      if (!token) {
         setError('Authentication required. Please log in.');
         setLoading(false);
         // Optionally redirect to login
         // navigate('/login');
         return; // Stop fetching if no token
      }

      try {
         // ** Prepare headers **
         const headers: HeadersInit = {
             'Content-Type': 'application/json',
             'Authorization': `${token}` // Add the token header
         };

         // ** Fetch with headers **
         const response = await fetch(backend_url + `/projects/by-id/${id}`, { headers }); // Pass headers

         console.log('Project Detail Response Status:', response.status); // Log status

         if (response.status === 404) {
             throw new Error('Project not found.');
         }
         if (response.status === 401) {
             // Handle unauthorized specifically, e.g., bad token
             setError('Authentication failed. Please log in again.');
             // Optionally clear token and redirect
             // localStorage.removeItem('token');
             // navigate('/login');
             throw new Error('Authentication failed.'); // Stop processing
         }
         if (!response.ok) {
             throw new Error(`Failed to fetch project (Status: ${response.status})`);
         }

         // Type assertion might be needed if backend keys don't perfectly match yet
         const data = await response.json();

         // Optional: Log fetched data for verification
         console.log("Fetched project data:", data);

         // Basic validation of expected fields before setting state
         if (!data || typeof data.title === 'undefined' || !Array.isArray(data.skills)) {
             throw new Error("Received incomplete project data from server.");
         }

         setProject(data as Project); // Set state (use 'as Project' if types align)

      } catch (err: any) {
         console.error("Error in fetchProject:", err);
         // Set error only if it wasn't already set (e.g., by auth failure)
         if (!error) {
             setError(err.message || 'An error occurred while fetching project details.');
         }
      } finally {
         setLoading(false);
      }
    };

    // Only fetch if ID is present
    if (id) {
        fetchProject();
    } else {
        setError("No project ID provided.");
        setLoading(false);
    }

  }, [id, navigate]);

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Navigation />

      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <p>Loading project details...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : project ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {project.title}
            </h1>
            <p className="text-gray-600 mb-4">
              {project.description}
            </p>
            <div className="mb-4">
              <span
                className={`inline-block ${
                  // You might also want optional chaining here for safety
                  project.domain?.toLowerCase() === 'computer-science' ? 'bg-purple-600' :
                  project.domain?.toLowerCase() === 'engineering' ? 'bg-blue-600' :
                  project.domain?.toLowerCase() === 'biology' ? 'bg-green-600' :
                  project.domain?.toLowerCase() === 'physics' ? 'bg-yellow-600 text-gray-800' : // Adjusted contrast
                  project.domain?.toLowerCase() === 'psychology' ? 'bg-red-600' :
                  project.domain?.toLowerCase() === 'chemistry' ? 'bg-indigo-600' : // Added color
                  'bg-gray-600' // Default color
                } text-white text-xs font-semibold px-3 py-1 rounded-full mr-2`}
              >
                {/* *** FIX HERE: Add check for project.domain *** */}
                {project.domain ? project.domain.replace('-', ' ') : 'Uncategorized'}
              </span>
              <span className="text-sm text-gray-500">
                 {/* Also good practice to check postedDate */}
                 Posted {project.postedDate ? project.postedDate : 'N/A'}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center mb-4">
              <img
                src={`/api/placeholder/36/36?name=${project.professor}`}
                // alt={project.professor}
                className="rounded-full"
              />
              <span className="ml-2 text-gray-700">{project.professor}</span>
            </div>

            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500 mr-2">
                {project.studentsNeeded} Students needed
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  project.availability === 'open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {project.availability === 'open'
                  ? `${project.spotsLeft} Spots left`
                  : 'Filled'}
              </span>
            </div>

            <button
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
              onClick={() => {
                // Implement further actions like applying for the project
              }}
            >
              Apply Now
            </button>
          </div>
        ) : null}

        <div className="mt-6">
          <button
            className="text-purple-600 hover:text-purple-800"
            onClick={() => navigate(-1)}
          >
            ← Back to Projects
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
