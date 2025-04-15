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
    const token = localStorage.getItem('token');
    // Fetch the project details from the backend using the id.
    const fetchProject = async () => {
      try {
        const response = await fetch(backend_url + `/projects/by-id/${id}`)
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data: Project = await response.json();
        setProject(data);
      } catch (err) {
        setError('Project not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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
                  project.domain === 'computer-science'
                    ? 'bg-purple-600'
                    : project.domain === 'engineering'
                      ? 'bg-blue-600'
                      : project.domain === 'biology'
                        ? 'bg-green-600'
                        : project.domain === 'physics'
                          ? 'bg-yellow-600'
                          : project.domain === 'psychology'
                            ? 'bg-red-600'
                            : 'bg-gray-600'
                } text-white text-xs font-semibold px-3 py-1 rounded-full mr-2`}
              >
                {project.domain.replace('-', ' ')}
              </span>
              <span className="text-sm text-gray-500">
                Posted {project.postedDate}
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
                src={`/api/placeholder/36/36?name=${project.professorId}`}
                alt={project.professor}
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
