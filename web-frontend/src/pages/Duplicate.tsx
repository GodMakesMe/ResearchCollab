import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import Navigation from '../components/Navigation'; // Adjust path if needed
import Footer from '../components/Footer'; // Adjust path if needed
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom'; // Only needed if redirecting
import { backend_url } from '../utils/constants'; // Adjust path if needed

// Project Interface (remains the same)
interface Project {
    id: number; title: string; description: string; domain: string | null;
    skills: string[]; professor: string; studentsNeeded: number; spotsLeft: number;
    postedDate: string; availability: 'Open' | 'Closed'; professorId: number;
}

// *** NEW: Interface for Pagination Data from Backend ***
interface PaginationInfo {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

// Date formatting helper (remains the same)
function formatTimeAgo(isoDateString: string | null): string { /* ... */
  if (!isoDateString) return 'N/A';
  try {
      const date = new Date(isoDateString);
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      let interval = seconds / 31536000; // years
      if (interval > 1) return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? 's' : '') + " ago";
      interval = seconds / 2592000; // months
      if (interval > 1) return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? 's' : '') + " ago";
      interval = seconds / 86400; // days
      if (interval > 1) return Math.floor(interval) + " day" + (Math.floor(interval) > 1 ? 's' : '') + " ago";
      interval = seconds / 3600; // hours
      if (interval > 1) return Math.floor(interval) + " hour" + (Math.floor(interval) > 1 ? 's' : '') + " ago";
      interval = seconds / 60; // minutes
      if (interval > 1) return Math.floor(interval) + " minute" + (Math.floor(interval) > 1 ? 's' : '') + " ago";
      return Math.floor(seconds) + " second" + (Math.floor(seconds) !== 1 ? 's' : '') + " ago";
  } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid date';
  }
}

const Old_Projects: React.FC = () => {
  // --- Filter Selection State (remains the same) ---
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedProfessors, setSelectedProfessors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [studentsRange, setStudentsRange] = useState(10);
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  // --- Applied Filters State (remains the same) ---
  const [appliedFilters, setAppliedFilters] = useState({
    skills: [] as string[], domains: [] as string[], professors: [] as string[],
    search: '', students: 10, openOnly: true
  });

  // --- Display State ---
  const [projectsToDisplay, setProjectsToDisplay] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading for main projects list
  const [error, setError] = useState<string | null>(null);
  const [activeFiltersForDisplay, setActiveFiltersForDisplay] = useState<Array<{ type: string, value: string }>>([]);
  // *** NEW Pagination State ***
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Track current page

   // --- State for Filter Options (remains the same) ---
   const [availableTopDomains, setAvailableTopDomains] = useState<string[]>([]); // Changed this back to fetch top domains
   const [loadingDomains, setLoadingDomains] = useState<boolean>(true);
   const [availableProfessors, setAvailableProfessors] = useState<string[]>([]);
   const [availableSkills, setAvailableSkills] = useState<string[]>([]);
   const [loadingProfessors, setLoadingProfessors] = useState<boolean>(true);
   const [loadingSkills, setLoadingSkills] = useState<boolean>(true);


  // --- Fetch Initial Filter Options (remains the same) ---
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoadingDomains(true); setLoadingProfessors(true); setLoadingSkills(true);
      const token = localStorage.getItem('token');
      const authHeaders: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) { authHeaders['Authorization'] = `${token}`; }
      const noAuthHeaders: HeadersInit = { 'Content-Type': 'application/json' };

      // Use correct paths based on backend routes setup
      const results = await Promise.allSettled([
         // Use the endpoint for ALL domains
         fetch(backend_url + '/projects/domains', { headers: authHeaders }), // Or /domains if separate route file
         fetch(backend_url + '/faculty', { headers: authHeaders }),
         fetch(backend_url + '/expertise', { headers: noAuthHeaders })
      ]);

      // Process Domain Results (now fetches ALL domains)
      if (results[0].status === 'fulfilled' && results[0].value.ok) {
          const data = await results[0].value.json();
          setAvailableTopDomains(data); // Assuming backend sends array of names for ALL domains now
      } else { console.error('Failed to fetch domains:', results[0].status === 'rejected' ? results[0].reason : results[0].value.status); }
      setLoadingDomains(false);

       // Process Professor Results
       if (results[1].status === 'fulfilled' && results[1].value.ok) {
           const data = await results[1].value.json();
           const profNames = data.faculty?.map((prof: any) => prof.name).filter(Boolean).sort() || [];
           setAvailableProfessors(profNames);
       } else { console.error('Failed to fetch professors:', results[1].status === 'rejected' ? results[1].reason : results[1].value.status); if(results[1].status === 'fulfilled' && results[1].value.status === 401) setError("Auth error professors"); }
       setLoadingProfessors(false);

       // Process Skill Results
       if (results[2].status === 'fulfilled' && results[2].value.ok) {
           const data = await results[2].value.json();
           const skillNames = data?.map((skill: any) => skill.name).filter(Boolean).sort() || [];
           setAvailableSkills(skillNames);
       } else { console.error('Failed to fetch skills:', results[2].status === 'rejected' ? results[2].reason : results[2].value.status); }
       setLoadingSkills(false);

      // ... optional general error handling ...
    };
    fetchFilterOptions();
  }, []);


  // --- Fetch Old_Projects Data (Main useEffect) ---
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      // Don't clear general errors here, only project-specific ones if needed
      // setError(null);

      const params = new URLSearchParams();
      // Add applied filters
      if (appliedFilters.search) params.set('search', appliedFilters.search);
      if (appliedFilters.skills.length > 0) params.set('skills', appliedFilters.skills.join(','));
      if (appliedFilters.domains.length > 0) params.set('domains', appliedFilters.domains.join(','));
      if (appliedFilters.professors.length > 0) params.set('professors', appliedFilters.professors.join(','));
      params.set('students', appliedFilters.students.toString());
      params.set('openOnly', String(appliedFilters.openOnly));
      params.set('sortBy', sortBy);
      // *** ADD CURRENT PAGE TO PARAMS ***
      params.set('page', currentPage.toString());
      params.set('limit', '10'); // Explicitly set limit if needed, matches backend default

      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) { headers['Authorization'] = `${token}`; }

        console.log(`Fetching: ${backend_url}/projects/filter?${params.toString()}`);
        const response = await fetch(backend_url + `/projects/filter?${params.toString()}`, { headers });

        if (!response.ok) {
             let errorData; try { errorData = await response.json(); } catch(e) { errorData = { message: `Status ${response.status}: ${response.statusText}` }; }
             if (response.status === 401) { setError('Authentication failed fetching projects.'); throw new Error('Auth failed'); }
             else { setError(errorData.message || `HTTP error! Status: ${response.status}`); throw new Error(errorData.message || `HTTP error! Status: ${response.status}`); }
        }

        // Expect response with projects and pagination
        const data = await response.json();

        if (data && data.projects && data.pagination) {
            setProjectsToDisplay(data.projects);
            setPagination(data.pagination);
             // Sync currentPage state with the actual page returned by the backend
             // Useful if the requested page was out of bounds
             if (currentPage !== data.pagination.currentPage) {
                 setCurrentPage(data.pagination.currentPage);
             }
             setError(null); // Clear previous project errors on success
        } else {
             console.error("Unexpected response format:", data);
             setError("Received invalid data format from server.");
             setProjectsToDisplay([]);
             setPagination(null);
        }

      } catch (err: any) {
        console.error("Error fetching projects:", err);
         // Only set error if it wasn't already set (e.g., by auth failure)
        if (!error && err.message !== 'Auth failed') { setError(err.message || "Failed to load projects."); }
        setProjectsToDisplay([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    // Fetch only when initial filter options are loaded
    if (!loadingDomains && !loadingProfessors && !loadingSkills) {
         fetchProjects();
    }
  }, [appliedFilters, sortBy, currentPage, loadingDomains, loadingProfessors, loadingSkills]); // Fetch when currentPage changes


  // --- Update Active Filters Display (remains the same) ---
  useEffect(() => { /* ... */
      const filters: Array<{ type: string, value: string }> = [];
      selectedDomains.forEach(d => filters.push({ type: 'domain', value: d }));
      selectedProfessors.forEach(p => filters.push({ type: 'professor', value: p }));
      selectedSkills.forEach(s => filters.push({ type: 'skill', value: s }));
      if (showOpenOnly) { filters.push({ type: 'availability', value: 'Open' }); }
      setActiveFiltersForDisplay(filters);
  }, [selectedDomains, selectedProfessors, selectedSkills, showOpenOnly]);


  // --- Filter Handlers ---
  const handleSkillToggle = (skill: string) => {/*...*/ setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]); };
  const handleDomainToggle = (domain: string) => {/*...*/ setSelectedDomains(prev => prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]); };
  const handleProfessorToggle = (professor: string) => {/*...*/ setSelectedProfessors(prev => prev.includes(professor) ? prev.filter(p => p !== professor) : [...prev, professor]); };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {/*...*/ setSearchQuery(e.target.value); };
  const handleStudentsRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {/*...*/ setStudentsRange(parseInt(e.target.value)); };
  const handleAvailabilityToggle = (e: React.ChangeEvent<HTMLInputElement>) => {/*...*/ setShowOpenOnly(e.target.checked); };
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value);
      setCurrentPage(1); // *** Reset to page 1 ***
  };
  const handleApplyFilters = () => {
      setAppliedFilters({ skills: selectedSkills, domains: selectedDomains, professors: selectedProfessors, search: searchQuery, students: studentsRange, openOnly: showOpenOnly });
      setCurrentPage(1); // *** Reset to page 1 ***
  };
  const removeFilter = (value: string, type: 'skill' | 'domain' | 'professor' | 'availability') => { /* Logic remains same */
    let filtersChanged = false;
    let newAppliedFilters = { ...appliedFilters };
    if (type === 'skill') { setSelectedSkills(prev => prev.filter(s => s !== value)); newAppliedFilters.skills = appliedFilters.skills.filter(s => s !== value); filtersChanged = true; }
    else if (type === 'domain') { setSelectedDomains(prev => prev.filter(d => d !== value)); newAppliedFilters.domains = appliedFilters.domains.filter(d => d !== value); filtersChanged = true; }
    else if (type === 'professor') { setSelectedProfessors(prev => prev.filter(p => p !== value)); newAppliedFilters.professors = appliedFilters.professors.filter(p => p !== value); filtersChanged = true; }
    else if (type === 'availability') { setShowOpenOnly(false); newAppliedFilters.openOnly = false; filtersChanged = true; }
    if (filtersChanged) { setAppliedFilters(newAppliedFilters); }
};
  const handleClearFilters = () => {
      // ... reset selected* and appliedFilters ...
      setSelectedSkills([]); setSelectedDomains([]); setSelectedProfessors([]);
      setSearchQuery(''); setStudentsRange(10); setShowOpenOnly(true);
      setAppliedFilters({ skills: [], domains: [], professors: [], search: '', students: 10, openOnly: true });
      setCurrentPage(1); // *** Reset to page 1 ***
      setSortBy('relevance');
  };

  // *** NEW Pagination Handlers ***
  const handlePageChange = (newPage: number) => {
      // Check boundaries before updating state
      if (newPage >= 1 && (!pagination || newPage <= pagination.totalPages)) {
          setCurrentPage(newPage);
          // Scroll to top for better UX on page change
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };
  // Optional: Handler for direct input change
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    if (inputVal === '') {
        // Allow clearing the input, maybe handle validation on blur or button click
        // For simplicity, we can just ignore empty string for direct state update
        return;
    }
    const inputPage = parseInt(inputVal, 10);
     // Update directly only if valid and within range
    if (!isNaN(inputPage) && inputPage >= 1 && (!pagination || inputPage <= pagination.totalPages)) {
        setCurrentPage(inputPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // You might want more sophisticated validation/debouncing for direct input
  };


  // --- Render Logic ---
  const isLoadingFilters = loadingDomains || loadingProfessors || loadingSkills;
  const isLoadingAnything = isLoadingFilters || loading;

  return (
    <div className="bg-gray-50 font-sans min-h-screen flex flex-col">
      <Navigation />
      {/* Header */}
       <section className="purple-gradient text-white py-12">
           <div className="container mx-auto px-6"> <h1 className="text-3xl font-bold mb-4">Research Old_Projects</h1> <p className="text-xl max-w-3xl"> Find the perfect research project... </p> </div>
       </section>

      {/* Main Content */}
      <section className="py-12 flex-grow"> {/* Added flex-grow */}
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4 mb-8 lg:mb-0 lg:mr-8">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                 {/* Filter Header, Search */}
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleClearFilters} disabled={isLoadingAnything}> Clear All </button>
                 </div>
                 <div className="mb-6"> {/* Search */}
                    <label htmlFor="search" className="block text-gray-700 font-medium mb-2">Search</label>
                    <div className="relative">
                        <input type="text" id="search" placeholder="Search by keywords..."
                               className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                               value={searchQuery} onChange={handleSearch} disabled={isLoadingAnything}/>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <i className="fas fa-search text-gray-400"></i> </div>
                    </div>
                 </div>

                 {/* Research Domain (Full List) */}
                 <div className="mb-6">
                   <h4 className="text-gray-800 font-medium mb-3">Research Domain</h4>
                   <div className="space-y-2 max-h-40 overflow-y-auto">
                     {loadingDomains ? (<p className="text-sm text-gray-500 italic">Loading domains...</p>)
                      : availableTopDomains.length > 0 ? (availableTopDomains.map(domainName => (
                           <div key={domainName} className="flex items-center">
                             <input type="checkbox" id={`domain-${domainName}`} checked={selectedDomains.includes(domainName)}
                                    onChange={() => handleDomainToggle(domainName)} disabled={loading}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-2 disabled:opacity-50"/>
                             <label htmlFor={`domain-${domainName}`} className="text-gray-700 capitalize">{domainName.replace('-', ' ')}</label>
                           </div>)))
                      : (<p className="text-sm text-gray-500 italic">No domains available.</p>)}
                   </div>
                 </div>

                 {/* Professor (Full List) */}
                 <div className="mb-6">
                   <h4 className="text-gray-800 font-medium mb-3">Professor</h4>
                   <div className="space-y-2 max-h-40 overflow-y-auto">
                     {loadingProfessors ? (<p className="text-sm text-gray-500 italic">Loading...</p>)
                       : availableProfessors.length > 0 ? availableProfessors.map(professor => (
                        <div key={professor} className="flex items-center">
                           <input type="checkbox" id={`professor-${professor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-2 disabled:opacity-50"
                                  checked={selectedProfessors.includes(professor)}
                                  onChange={() => handleProfessorToggle(professor)} disabled={loading}/>
                           <label htmlFor={`professor-${professor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="ml-2 text-gray-700">{professor}</label>
                         </div>
                       )) : (<p className="text-sm text-gray-500 italic">No professors.</p>)}
                    </div>
                 </div>

                 {/* Skills (Full List) */}
                 <div className="mb-6">
                   <h4 className="text-gray-800 font-medium mb-3">Skills Required</h4>
                   <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                     {loadingSkills ? (<p className="text-sm text-gray-500 italic">Loading...</p>)
                       : availableSkills.length > 0 ? availableSkills.map(skill => (
                       <button key={skill} type="button"
                               className={`tag px-3 py-1 rounded-full text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 ${selectedSkills.includes(skill) ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                               onClick={() => handleSkillToggle(skill)} aria-pressed={selectedSkills.includes(skill)} disabled={loading}> {skill} </button>
                       )) : (<p className="text-sm text-gray-500 italic">No skills.</p>)}
                   </div>
                 </div>

                 {/* Students Needed Slider, Availability Checkbox */}
                  <div className="mb-6"> {/* Students */}
                    <label htmlFor="students-range" className="text-gray-800 font-medium mb-3 block">Max Students Needed</label>
                    <div className="px-2">
                        <input id="students-range" type="range" min="1" max="10" value={studentsRange}
                               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50"
                               onChange={handleStudentsRangeChange} disabled={isLoadingAnything}/>
                        <div className="flex justify-between text-gray-600 text-sm mt-2"><span>1</span><span className="font-semibold text-purple-700">{studentsRange}</span><span>10+</span></div>
                    </div>
                 </div>
                 <div className="mb-6"> {/* Availability */}
                    <h4 className="text-gray-800 font-medium mb-3">Availability</h4>
                    <div className="space-y-2"> <div className="flex items-center">
                        <input type="checkbox" id="avail-open" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-2 disabled:opacity-50"
                               checked={showOpenOnly} onChange={handleAvailabilityToggle} disabled={isLoadingAnything}/>
                        <label htmlFor="avail-open" className="ml-2 text-gray-700"> Show Open Positions Only </label>
                    </div> </div>
                 </div>

                 {/* Apply Filters Button */}
                 <button
                   className={`w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-150 ease-in-out ${isLoadingAnything ? 'opacity-50 cursor-not-allowed' : ''}`}
                   onClick={handleApplyFilters} disabled={isLoadingAnything}>
                   {loading ? 'Applying...' : 'Apply Filters'}
                 </button>
              </div>
            </div> {/* End Filters Sidebar */}

            {/* Project Results Section */}
            <div className="lg:w-3/4">
               {/* Results Header */}
               <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div> <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Old_Projects</h2>
                          <p className="text-gray-600">
                              {loading ? 'Loading...' : pagination ? `Showing ${projectsToDisplay.length} of ${pagination.totalItems} projects` : 'Loading...'}
                          </p>
                      </div>
                       {/* Sort Control */}
                      <div className="mt-4 md:mt-0 flex items-center"> <label htmlFor="sort-by" className="text-gray-700 mr-2">Sort by:</label>
                          <select id="sort-by" className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                                  value={sortBy} onChange={handleSortChange} disabled={loading}>
                              <option value="relevance">Relevance</option> <option value="newest">Newest</option> <option value="spots">Available Spots</option>
                          </select>
                      </div>
                  </div>
                   {/* Active Filters Display */}
                   {activeFiltersForDisplay.length > 0 && ( <div className="mt-6 pt-4 border-t border-gray-200"> <h4 className="text-sm text-gray-600 mb-2 font-medium">Active Filters:</h4> <div className="flex flex-wrap gap-2">
                       {activeFiltersForDisplay.map(filterInfo => ( <span key={`${filterInfo.type}-${filterInfo.value}`} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center">
                           {filterInfo.type === 'domain' ? filterInfo.value.replace('-', ' ') : filterInfo.value}
                           <button className={`ml-2 text-purple-600 hover:text-purple-900 focus:outline-none ${loading ? 'cursor-not-allowed' : ''}`}
                                   onClick={() => !loading && removeFilter(filterInfo.value, filterInfo.type as any)} aria-label={`Remove filter: ${filterInfo.value}`} disabled={loading}> <i className="fas fa-times text-xs"></i> </button>
                       </span> ))}
                   </div> </div> )}
               </div> {/* End Results Header */}

                {/* Combined Loading/Error/Results Display */}
                {isLoadingFilters ? ( // Show loading indicator while fetching filters initially
                    <div className="text-center py-10"><p className="text-gray-500 italic">Loading filter options...</p></div>
                ) : loading ? ( // Show loading indicator while fetching projects
                    <div className="text-center py-10"><p className="text-purple-600">Loading projects...</p></div>
                ) : error ? ( // Show error message
                     <div className="text-center py-10 bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
                         <p><strong>Error:</strong> {error}</p> <p>Please try refreshing or clearing filters. Check login status if authentication errors persist.</p>
                     </div>
                ) : ( // Show Results Grid and Pagination
                    <>
                         <div className="grid grid-cols-1 gap-6">
                             {projectsToDisplay.length > 0 ? ( projectsToDisplay.map(project => (
                                 // --- Project Card component ---
                                 <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden project-card hover:shadow-lg transition-shadow duration-200">
                                     {/* Header */}
                                     <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                                         <span className={`inline-block text-white text-xs font-semibold px-3 py-1 rounded-full ${ /* Domain color logic */
                                            project.domain?.toLowerCase() === 'computer-science' ? 'bg-purple-600' : project.domain?.toLowerCase() === 'engineering' ? 'bg-blue-600' : project.domain?.toLowerCase() === 'biology' ? 'bg-green-600' : project.domain?.toLowerCase() === 'physics' ? 'bg-yellow-600 text-gray-800' : project.domain?.toLowerCase() === 'psychology' ? 'bg-red-600' : project.domain?.toLowerCase() === 'chemistry' ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                                            {project.domain ? project.domain.replace('-', ' ') : 'Uncategorized'}
                                         </span>
                                         <span className="text-gray-500 text-sm">Posted {formatTimeAgo(project.postedDate)}</span>
                                     </div>
                                     {/* Body */}
                                     <div className="p-6">
                                         <h3 className="text-xl font-semibold mb-2 text-gray-800">{project.title}</h3>
                                         <p className="text-gray-600 mb-4 text-sm leading-relaxed">{project.description}</p>
                                         {/* Skills */}
                                         <div className="flex flex-wrap gap-2 mb-4">
                                             {project.skills?.length > 0 ? project.skills.map(skill => (<span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{skill}</span>)) : <span className="text-xs text-gray-500 italic">No specific skills listed</span>}
                                         </div>
                                         {/* Professor */}
                                         <div className="flex items-center mb-4">
                                             <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.professor || 'N A')}&background=random&color=fff&size=36`} alt={`${project.professor || 'Professor'} avatar`} className="rounded-full w-9 h-9 mr-2 border border-gray-200"/>
                                             <span className="ml-2 text-gray-700 font-medium">{project.professor || 'N/A'}</span>
                                         </div>
                                          {/* Footer */}
                                         <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                             <div className="flex items-center space-x-2">
                                                 <span className="text-sm text-gray-500"><i className="fas fa-users mr-1 text-gray-400"></i> {project.studentsNeeded} Student{project.studentsNeeded !== 1 ? 's' : ''} needed</span>
                                                 <span className={`text-xs px-2 py-1 rounded-full font-semibold ${project.availability === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}> {project.availability} </span>
                                             </div>
                                             <Link to={`/project/${project.id}`} className="text-purple-600 hover:text-purple-800 font-medium text-sm"> Details → </Link>
                                         </div>
                                     </div>
                                 </div>
                             ))) : ( /* No results message */
                                 <div className="text-center py-10 text-gray-500 col-span-full">
                                     <p>No projects match the current filters.</p>
                                     <button onClick={handleClearFilters} className="mt-4 text-purple-600 hover:underline"> Clear filters and try again? </button>
                                 </div>
                             )}
                         </div> {/* End Results Grid */}

                         {/* *** PAGINATION CONTROLS *** */}
                         {pagination && pagination.totalPages > 1 && (
                             <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3">
                                 {/* Previous Button */}
                                 <button
                                     onClick={() => handlePageChange(currentPage - 1)}
                                     disabled={currentPage <= 1 || loading}
                                     className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     Previous
                                 </button>

                                 {/* Page Number Info & Input */}
                                 <div className="flex items-center justify-center space-x-2">
                                     <span className="text-sm text-gray-700 hidden sm:inline">Page</span>
                                     <input
                                         type="number"
                                         value={currentPage}
                                         min={1}
                                         max={pagination.totalPages}
                                         onChange={handlePageInputChange}
                                         onBlur={(e) => { // Optional: Validate on blur if needed
                                            const inputPage = parseInt(e.target.value, 10);
                                            if (isNaN(inputPage) || inputPage < 1) handlePageChange(1);
                                            else if (inputPage > pagination.totalPages) handlePageChange(pagination.totalPages);
                                         }}
                                         aria-label="Current page"
                                         className="w-16 border border-gray-300 rounded-md py-1.5 px-2 text-center text-sm focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                         disabled={loading}
                                     />
                                     <span className="text-sm text-gray-700">
                                         of {pagination.totalPages}
                                     </span>
                                 </div>

                                 {/* Next Button */}
                                 <button
                                     onClick={() => handlePageChange(currentPage + 1)}
                                     disabled={currentPage >= pagination.totalPages || loading}
                                     className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     Next
                                 </button>
                             </div>
                         )}
                    </>
                )}
            </div> {/* End Project Results Section */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Old_Projects;

