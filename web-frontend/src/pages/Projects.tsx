import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

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




const Projects: React.FC = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedProfessors, setSelectedProfessors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [studentsRange, setStudentsRange] = useState(3);
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState({
    skills: [] as string[],
    domains: [] as string[],
    professors: [] as string[],
    search: '',
    students: 3,
    openOnly: true
  });
  

  const projects: Project[] = [
    {
      id: 1,
      title: 'Neural Networks for Climate Prediction',
      description: 'Using deep learning models to improve climate change predictions based on historical data.',
      domain: 'computer-science',
      skills: ['Python', 'TensorFlow', 'Data Analysis', 'Machine Learning'],
      professor: 'Prof. Sarah Johnson',
      professorId: 'johnson',
      studentsNeeded: 3,
      spotsLeft: 2,
      postedDate: '2 days ago',
      availability: 'open'
    },
    {
      id: 2,
      title: 'CRISPR Applications in Agriculture',
      description: 'Investigating gene editing techniques to improve crop resistance to drought and disease.',
      domain: 'biology',
      skills: ['Lab Work', 'Genetics', 'Statistics', 'R'],
      professor: 'Prof. Michael Chen',
      professorId: 'chen',
      studentsNeeded: 4,
      spotsLeft: 1,
      postedDate: '1 week ago',
      availability: 'open'
    },
    {
      id: 3,
      title: 'Quantum Algorithms for Drug Discovery',
      description: 'Developing quantum computational methods to accelerate pharmaceutical research.',
      domain: 'physics',
      skills: ['Python', 'Qiskit', 'Physics', 'MATLAB'],
      professor: 'Prof. David Rodriguez',
      professorId: 'rodriguez',
      studentsNeeded: 2,
      spotsLeft: 0,
      postedDate: '3 weeks ago',
      availability: 'filled'
    },
    {
      id: 4,
      title: 'Social Media Effects on Cognitive Development',
      description: 'Analyzing how extensive social media use affects cognitive abilities in adolescents.',
      domain: 'psychology',
      skills: ['Statistics', 'R', 'Survey Design', 'Data Analysis'],
      professor: 'Prof. Priya Patel',
      professorId: 'patel',
      studentsNeeded: 5,
      spotsLeft: 3,
      postedDate: '5 days ago',
      availability: 'open'
    },
    {
      id: 5,
      title: 'Sustainable Energy Solutions',
      description: 'Researching innovative approaches to renewable energy storage and distribution.',
      domain: 'engineering',
      skills: ['Physics', 'Chemistry', 'MATLAB', 'Data Analysis'],
      professor: 'Prof. James Wilson',
      professorId: 'wilson',
      studentsNeeded: 3,
      spotsLeft: 2,
      postedDate: '4 days ago',
      availability: 'open'
    },
    {
      id: 6,
      title: 'AI in Healthcare Diagnostics',
      description: 'Developing machine learning models for early disease detection and diagnosis.',
      domain: 'computer-science',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'Statistics'],
      professor: 'Prof. Emily Brown',
      professorId: 'brown',
      studentsNeeded: 4,
      spotsLeft: 1,
      postedDate: '1 day ago',
      availability: 'open'
    }
  ];

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };
  
  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const handleProfessorToggle = (professor: string) => {
    setSelectedProfessors(prev =>
      prev.includes(professor) ? prev.filter(p => p !== professor) : [...prev, professor]
    );
  };


  const [fetchedProjects, setFetchedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = new URLSearchParams({
          skills: appliedFilters.skills.join(','),
          domain: appliedFilters.domains.join(','),
          professor: appliedFilters.professors.join(','),
          students: appliedFilters.students.toString(),
          openOnly: appliedFilters.openOnly.toString(),
          search: appliedFilters.search,
          sort: sortBy
        });

        const response = await fetch(`/projects?${params.toString()}`);
        const data = await response.json();
        setFetchedProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [appliedFilters, sortBy]);


  // const handleDomainChange = (domain: string) => {
  //   setSelectedDomain(domain);
  // };

  // const handleProfessorChange = (professor: string) => {
  //   setSelectedProfessor(prev => prev === professor ? '' : professor);
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStudentsRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentsRange(parseInt(e.target.value));
  };

  const handleAvailabilityToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowOpenOnly(e.target.checked);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      skills: selectedSkills,
      domains: selectedDomains,
      professors: selectedProfessors,
      search: searchQuery,
      students: studentsRange,
      openOnly: showOpenOnly
    });
  };
  

  const removeFilter = (filter: string) => {
    if (selectedSkills.includes(filter)) {
      setSelectedSkills(prev => prev.filter(s => s !== filter));
    } else if (selectedDomains.includes(filter)) {
      setSelectedDomains(prev => prev.filter(d => d !== filter));
    } else if (selectedProfessors.includes(filter)) {
      setSelectedProfessors(prev => prev.filter(p => p !== filter));
    }
  };
  

  // useEffect(() => {
  //   const filters: string[] = [];
  //   if (selectedDomain) filters.push(selectedDomain);
  //   if (selectedProfessor) filters.push(selectedProfessor);
  //   if (selectedSkills.length > 0) filters.push(...selectedSkills);
  //   if (showOpenOnly) filters.push('Open Positions');
  //   setActiveFilters(filters);
  // }, [selectedDomain, selectedProfessor, selectedSkills, showOpenOnly]);

  useEffect(() => {
    const filters: string[] = [
      ...selectedDomains,
      ...selectedProfessors,
      ...selectedSkills,
    ];
    if (showOpenOnly) filters.push('Open Positions');
    setActiveFilters(filters);
  }, [selectedDomains, selectedProfessors, selectedSkills, showOpenOnly]);
  
  const handleClearFilters = () => {
    setSelectedSkills([]);
    setSelectedDomains([]);
    setSelectedProfessors([]);
    setSearchQuery('');
    setStudentsRange(3);
    setShowOpenOnly(true);
  };
  
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
      project.description.toLowerCase().includes(appliedFilters.search.toLowerCase());
  
    const matchesDomains = appliedFilters.domains.length === 0 ||
      appliedFilters.domains.includes(project.domain);
  
    const matchesProfessors = appliedFilters.professors.length === 0 ||
      appliedFilters.professors.includes(project.professor);
  
    const matchesSkills = appliedFilters.skills.length === 0 ||
      appliedFilters.skills.some(skill => project.skills.includes(skill));
  
    const matchesStudents = project.studentsNeeded <= appliedFilters.students;
    const matchesAvailability = !appliedFilters.openOnly || project.availability === 'open';
  
    return matchesSearch && matchesDomains && matchesProfessors && matchesSkills && matchesStudents && matchesAvailability;
  });
  

  return (
    <div className="bg-gray-50 font-sans">
      <Navigation />

      {/* Projects Header */}
      <section className="purple-gradient text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-4">Research Projects</h1>
          <p className="text-xl max-w-3xl">
            Find the perfect research project that matches your skills, interests, and academic goals.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4 mb-8 lg:mb-0 lg:mr-8">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                  <button
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    onClick={handleClearFilters}
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label htmlFor="search" className="block text-gray-700 font-medium mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      placeholder="Search by keywords..."
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-search text-gray-400"></i>
                    </div>
                  </div>
                </div>

                {/* Research Domain */}
                <div className="mb-6">
                  <h4 className="text-gray-800 font-medium mb-3">Research Domain</h4>
                  <div className="space-y-2">
                    {['computer-science', 'biology', 'physics', 'chemistry', 'psychology', 'engineering'].map(domain => (
                      <div key={domain} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`domain-${domain}`}
                          checked={selectedDomains.includes(domain)}
                          onChange={() => handleDomainToggle(domain)}
                          className="mr-2"
                        />
                        <label htmlFor={`domain-${domain}`} className="text-gray-700 capitalize">
                          {domain.replace('-', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Professor */}
                <div className="mb-6">
                  <h4 className="text-gray-800 font-medium mb-3">Professor</h4>
                  <div className="space-y-2">
                    {projects.map(project => project.professor).filter((professor, index, self) => 
                      self.indexOf(professor) === index
                    ).map(professor => (
                      <div key={professor} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`professor-${professor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          checked={selectedProfessors.includes(professor)}
                          onChange={() => handleProfessorToggle(professor)}
                        />
                        <label 
                          htmlFor={`professor-${professor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} 
                          className="ml-2 text-gray-700"
                        >
                          {professor}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-gray-800 font-medium mb-3">Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'R', 'Machine Learning', 'Data Analysis', 'Statistics', 'MATLAB', 'Lab Work', 'Physics', 'Chemistry'].map(skill => (
                      <span
                        key={skill}
                        className={`tag px-3 py-1 rounded-full text-sm cursor-pointer ${
                          selectedSkills.includes(skill)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Students Needed */}
                <div className="mb-6">
                  <h4 className="text-gray-800 font-medium mb-3">Students Needed</h4>
                  <div className="px-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={studentsRange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      onChange={handleStudentsRangeChange}
                    />
                    <div className="flex justify-between text-gray-600 text-sm mt-2">
                      <span>1</span>
                      <span>{studentsRange}</span>
                      <span>10+</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <h4 className="text-gray-800 font-medium mb-3">Availability</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="avail-open"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={showOpenOnly}
                        onChange={handleAvailabilityToggle}
                      />
                      <label htmlFor="avail-open" className="ml-2 text-gray-700">
                        Open Positions
                      </label>
                    </div>
                  </div>
                </div>

                {/* Apply Filters Button */}
                <button
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Project Results Section */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Projects</h2>
                    <p className="text-gray-600">Showing {filteredProjects.length} projects</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center">
                    <span className="text-gray-700 mr-2">Sort by:</span>
                    <select
                      className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={sortBy}
                      onChange={handleSortChange}
                    >
                      <option value="relevance">Relevance</option>
                      <option value="newest">Newest</option>
                      <option value="deadline">Application Deadline</option>
                      <option value="spots">Available Spots</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm text-gray-600 mb-2">Active Filters:</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.map(filter => (
                        <span
                          key={filter}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center"
                        >
                          {filter}
                          <button
                            className="ml-2 text-purple-800 hover:text-purple-600 focus:outline-none"
                            onClick={() => removeFilter(filter)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 gap-6">
                {filteredProjects.map(project => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden project-card"
                  >
                    <div className="flex flex-row">
                      <div className="bg-purple-100 p-4 flex justify-between items-center w-full">
                        <span className={`${
                          project.domain === 'computer-science' ? 'bg-purple-600' :
                          project.domain === 'engineering' ? 'bg-blue-600' :
                          project.domain === 'biology' ? 'bg-green-600' :
                          project.domain === 'physics' ? 'bg-yellow-600' :
                          project.domain === 'psychology' ? 'bg-red-600' :
                          'bg-gray-600'
                        } text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                          {project.domain.replace('-', ' ')}
                        </span>
                        <span className="text-gray-600 text-sm">Posted {project.postedDate}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills.map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center mb-4">
                        <img src={`/api/placeholder/36/36?name=${project.professorId}`} alt={project.professor} className="rounded-full" />
                        <span className="ml-2 text-gray-700">{project.professor}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {project.studentsNeeded} Students needed
                          </span>
                          <span
                            className={`${
                              project.availability === 'open'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            } text-xs px-2 py-1 rounded-full`}
                          >
                            {project.availability === 'open'
                              ? `${project.spotsLeft} Spots left`
                              : 'Filled'}
                          </span>
                        </div>
                        <a href="#" className="text-purple-600 hover:text-purple-800">
                          Details →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects; 