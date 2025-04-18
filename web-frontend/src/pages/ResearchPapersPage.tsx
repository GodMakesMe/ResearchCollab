import React, { useState } from 'react';
import './ResearchPapersPage.css';
import logo from '../assets/Logo_Center.png';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

// Define the paper interface and sample data
interface Paper {
  id: number;
  title: string;
  abstract: string;
  researchArea: string;
}


const samplePapers: Paper[] = [
  {
    id: 1,
    title: 'Deep Learning in Medical Imaging',
    abstract:
      'This paper explores advanced deep learning methodologies to improve diagnostic accuracy and analyzes various neural network architectures.',
    researchArea: 'Artificial Intelligence & Healthcare',
  },
  {
    id: 2,
    title: 'Sustainable Energy Systems',
    abstract:
      'A comprehensive study of renewable energy sources focusing on solar and wind integration into modern grids.',
    researchArea: 'Renewable Energy',
  },
  {
    id: 3,
    title: 'Quantum Computing Algorithms',
    abstract:
      'An analysis of the latest quantum computing algorithms and their applications in cryptography, optimization, and simulation.',
    researchArea: 'Quantum Computing',
  },
  {
    id: 4,
    title: 'Internet of Things in Smart Cities',
    abstract:
      'An investigation of IoT implementations and their impact on enhancing urban infrastructure and services.',
    researchArea: 'Smart Cities & IoT',
  },
];

const ResearchPapersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook
  // Filter papers based on search query. It checks title and research area.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) navigate('/');
      } catch (err) {
        navigate('/');
      }
    }
  }, [navigate]);
  const filteredPapers = samplePapers.filter((paper) => {
    return (
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.researchArea.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="rp-container">
      <header className="rp-header">
        <img src={logo} alt="Logo" className="rp-logo" />
        <h1 className="rp-page-title">Research Papers by Professors</h1>
        <input
          type="text"
          placeholder="Search papers by title or area..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rp-search-input"
        />
      </header>
      <div className="rp-grid">
        {filteredPapers.map((paper) => (
          <div key={paper.id} className="rp-card">
            <div className="rp-card-content">
              <h2 className="rp-card-title">{paper.title}</h2>
              <p className="rp-card-abstract">
                {paper.abstract.length > 100
                  ? paper.abstract.substring(0, 100) + '...'
                  : paper.abstract}
              </p>
              <p className="rp-card-area"><strong>Area:</strong> {paper.researchArea}</p>
            </div>
            <div className="rp-card-overlay">
              <div className="rp-overlay-text">
                <p>Read More</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchPapersPage;
