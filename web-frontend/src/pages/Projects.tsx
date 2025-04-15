import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation'; // Adjust path if needed
import Footer from '../components/Footer'; // Adjust path if needed
import {backend_url} from '../utils/constants'; // Adjust path if needed
// Interface remains the same
interface Project {
  id: number;
  title: string;
  description: string;
  domain: string | null;
  skills: string[];
  professor: string;
  studentsNeeded: number;
  spotsLeft: number;
  postedDate: string; // Corresponds to start_date
  availability: 'Open' | 'Closed';
  professorId: number; // faculty_id
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

const Projects: React.FC = () => {
  // --- Filter Selection State ---
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedProfessors, setSelectedProfessors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [studentsRange, setStudentsRange] = useState(10);
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  // --- Applied Filters State ---
  const [appliedFilters, setAppliedFilters] = useState({
    skills: [] as string[], domains: [] as string[], professors: [] as string[],
    search: '', students: 10, openOnly: true
  });

  // --- Display State ---
  const [projectsToDisplay, setProjectsToDisplay] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading for main projects list
  const [error, setError] = useState<string | null>(null);
  const [activeFiltersForDisplay, setActiveFiltersForDisplay] = useState<Array<{ type: string, value: string }>>([]);

   // --- State for Filter Options (Populated from API) ---
   const [availableTopDomains, setAvailableTopDomains] = useState<string[]>([]);
   const [loadingDomains, setLoadingDomains] = useState<boolean>(true);
   // ** NEW ** State for ALL professors and skills
   const [availableProfessors, setAvailableProfessors] = useState<string[]>([]);
   const [availableSkills, setAvailableSkills] = useState<string[]>([]);
   const [loadingProfessors, setLoadingProfessors] = useState<boolean>(true);
   const [loadingSkills, setLoadingSkills] = useState<boolean>(true);


  // --- Fetch Initial Filter Options (Domains, Professors, Skills) ---
  useEffect(() => {
    const fetchFilterOptions = async () => {
        // Set all loading states true initially
        setLoadingDomains(true);
        setLoadingProfessors(true);
        setLoadingSkills(true);

        // Prepare Auth Header (if needed)
        const token = localStorage.getItem('token'); // Example
        console.log("Token:", token); // Debugging line
        const authHeaders: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) {
            authHeaders['Authorization'] = `${token}`;
        }
        const noAuthHeaders: HeadersInit = { 'Content-Type': 'application/json' };


        // Use Promise.allSettled to fetch concurrently and handle individual failures
        const results = await Promise.allSettled([
            // Fetch Top Domains
            fetch(backend_url + '/projects/top-domains', { headers: authHeaders }), // Requires Auth
            // Fetch All Professors
            fetch(backend_url + '/faculty', { headers: authHeaders }), // Requires Auth (mounted at /faculty in app.js)
             // Fetch All Skills (Expertise)
            fetch(backend_url + '/expertise', { headers: noAuthHeaders }) // No Auth needed (mounted at /expertise in app.js)
        ]);

        // Process Domain Results
        if (results[0].status === 'fulfilled') {
            const response = results[0].value;
            if (response.ok) {
                const data = await response.json();
                setAvailableTopDomains(data);
            } else {
                console.error(`Error fetching domains: ${response.status}`);
                // Optionally set specific error state
            }
        } else {
            console.error('Failed to fetch domains:', results[0].reason);
        }
        setLoadingDomains(false);

        // Process Professor Results
        if (results[1].status === 'fulfilled') {
            const response = results[1].value;
            if (response.ok) {
                const data = await response.json();
                // Extract names from the { faculty: [...] } structure
                const profNames = data.faculty?.map((prof: any) => prof.name).filter(Boolean).sort() || [];
                setAvailableProfessors(profNames);
            } else {
                 console.error(`Error fetching professors: ${response.status}`);
                 if(response.status === 401) setError("Authentication error fetching professors.");
            }
        } else {
            console.error('Failed to fetch professors:', results[1].reason);
        }
         setLoadingProfessors(false);

        // Process Skill Results
        if (results[2].status === 'fulfilled') {
            const response = results[2].value;
            if (response.ok) {
                const data = await response.json();
                 // Extract names from the array of { name: ... } structure
                const skillNames = data?.map((skill: any) => skill.name).filter(Boolean).sort() || [];
                setAvailableSkills(skillNames);
            } else {
                console.error(`Error fetching skills: ${response.status}`);
            }
        } else {
            console.error('Failed to fetch skills:', results[2].reason);
        }
        setLoadingSkills(false);

        // Set general error if any fetch failed badly (optional)
        if (results.some(r => r.status === 'rejected')) {
             if (!error) { // Don't overwrite specific auth errors
                 setError("Failed to load some filter options. Functionality may be limited.");
             }
        }
    };

    fetchFilterOptions();
  }, []); // Empty dependency array -> runs once on mount


  // --- Fetch Projects Data (Main useEffect) ---
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); // Loading for the project list itself
      // REMOVED setLoadingProfSkills
      setError(null); // Clear previous general errors

      const params = new URLSearchParams();
      // ... (parameter construction remains the same) ...
      if (appliedFilters.search) params.set('search', appliedFilters.search);
      if (appliedFilters.skills.length > 0) params.set('skills', appliedFilters.skills.join(','));
      if (appliedFilters.domains.length > 0) params.set('domains', appliedFilters.domains.join(','));
      if (appliedFilters.professors.length > 0) params.set('professors', appliedFilters.professors.join(','));
      params.set('students', appliedFilters.students.toString());
      params.set('openOnly', String(appliedFilters.openOnly));
      params.set('sortBy', sortBy);

      try {
        // Auth Header
        const token = localStorage.getItem('authToken');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(backend_url + `/projects/filter?${params.toString()}`, { headers });

        if (!response.ok) {
            let errorData; try { errorData = await response.json(); } catch(e) { errorData = { message: response.statusText }; }
            if (response.status === 401) {
                // Handle auth error more specifically if needed (e.g., redirect)
                 setError('Authentication failed fetching projects. Please log in.');
                 throw new Error('Authentication failed.'); // Stop further processing
            } else {
                setError(errorData.message || `HTTP error! Status: ${response.status}`);
                 throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
        }

        const data: Project[] = await response.json();
        setProjectsToDisplay(data);

        // --- REMOVED DYNAMIC FILTER POPULATION ---
        // const allProfs = [...new Set(data.map(p => p.professor).filter(Boolean))].sort(); // REMOVED
        // const allSkills = [...new Set(data.flatMap(p => p.skills).filter(Boolean))].sort(); // REMOVED
        // setAvailableProfessors(allProfs); // REMOVED
        // setAvailableSkills(allSkills); // REMOVED

      } catch (err: any) {
        console.error("Error fetching projects:", err);
        // Error state might already be set by the response check
        if (!error && err.message !== 'Authentication failed.') {
             setError(err.message || "Failed to load projects.");
        }
        setProjectsToDisplay([]); // Clear data on error
      } finally {
        setLoading(false); // Done loading projects
        // REMOVED setLoadingProfSkills
      }
    };

    // Only fetch projects if the initial filter options have loaded (or tried to load)
    // This prevents fetching projects before filter lists are potentially available
    if (!loadingDomains && !loadingProfessors && !loadingSkills) {
         fetchProjects();
    }

  }, [appliedFilters, sortBy, loadingDomains, loadingProfessors, loadingSkills]); // Add dependencies for initial loads


  // --- Update Active Filters Display (remains the same) ---
  useEffect(() => { /* ... */
    const filters: Array<{ type: 'skill' | 'domain' | 'professor' | 'availability', value: string }> = [];
    selectedDomains.forEach(d => filters.push({ type: 'domain', value: d }));
    selectedProfessors.forEach(p => filters.push({ type: 'professor', value: p }));
    selectedSkills.forEach(s => filters.push({ type: 'skill', value: s }));
    if (showOpenOnly) {
        filters.push({ type: 'availability', value: 'Open Positions' });
    }
    setActiveFiltersForDisplay(filters);
  }, [selectedDomains, selectedProfessors, selectedSkills, showOpenOnly]);


  // --- Filter Handlers (remain the same) ---
  const handleSkillToggle = (skill: string) => {/*...*/ setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]); };
  const handleDomainToggle = (domain: string) => {/*...*/ setSelectedDomains(prev => prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]); };
  const handleProfessorToggle = (professor: string) => {/*...*/ setSelectedProfessors(prev => prev.includes(professor) ? prev.filter(p => p !== professor) : [...prev, professor]); };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {/*...*/ setSearchQuery(e.target.value); };
  const handleStudentsRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {/*...*/ setStudentsRange(parseInt(e.target.value)); };
  const handleAvailabilityToggle = (e: React.ChangeEvent<HTMLInputElement>) => {/*...*/ setShowOpenOnly(e.target.checked); };
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {/*...*/ setSortBy(e.target.value); };
  const handleApplyFilters = () => {/*...*/ setAppliedFilters({ skills: selectedSkills, domains: selectedDomains, professors: selectedProfessors, search: searchQuery, students: studentsRange, openOnly: showOpenOnly }); };
  const removeFilter = (value: string, type: 'skill' | 'domain' | 'professor' | 'availability') => { /* Logic remains same */
      let filtersChanged = false;
      let newAppliedFilters = { ...appliedFilters };
      if (type === 'skill') { setSelectedSkills(prev => prev.filter(s => s !== value)); newAppliedFilters.skills = appliedFilters.skills.filter(s => s !== value); filtersChanged = true; }
      else if (type === 'domain') { setSelectedDomains(prev => prev.filter(d => d !== value)); newAppliedFilters.domains = appliedFilters.domains.filter(d => d !== value); filtersChanged = true; }
      else if (type === 'professor') { setSelectedProfessors(prev => prev.filter(p => p !== value)); newAppliedFilters.professors = appliedFilters.professors.filter(p => p !== value); filtersChanged = true; }
      else if (type === 'availability') { setShowOpenOnly(false); newAppliedFilters.openOnly = false; filtersChanged = true; }
      if (filtersChanged) { setAppliedFilters(newAppliedFilters); }
  };
  const handleClearFilters = () => { /* Logic remains same */
      setSelectedSkills([]); setSelectedDomains([]); setSelectedProfessors([]);
      setSearchQuery(''); setStudentsRange(10); setShowOpenOnly(true);
      setAppliedFilters({ skills: [], domains: [], professors: [], search: '', students: 10, openOnly: true });
      setSortBy('relevance');
  };


  // --- Render Logic ---
  // Combined loading state for disabling filters
  const isLoadingFilters = loadingDomains || loadingProfessors || loadingSkills;
  const isLoadingAnything = isLoadingFilters || loading;

  return (
    <div className="bg-gray-50 font-sans">
      <Navigation />
      {/* ... Header ... */}
       <section className="purple-gradient text-white py-12"> {/* Header */}
           <div className="container mx-auto px-6"> <h1 className="text-3xl font-bold mb-4">Research Projects</h1> <p className="text-xl max-w-3xl"> Find the perfect research project... </p> </div>
       </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4 mb-8 lg:mb-0 lg:mr-8">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                 {/* Filter Header */}
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleClearFilters} disabled={isLoadingAnything}> Clear All </button>
                 </div>
                  {/* Search */}
                 <div className="mb-6">
                    <label htmlFor="search" className="block text-gray-700 font-medium mb-2">Search</label>
                    <div className="relative">
                        <input type="text" id="search" placeholder="Search by keywords..."
                               className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                               value={searchQuery} onChange={handleSearch} disabled={isLoadingAnything}/>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <i className="fas fa-search text-gray-400"></i> </div>
                    </div>
                 </div>

                 {/* Research Domain (Top 5) */}
                 <div className="mb-6">
                   <h4 className="text-gray-800 font-medium mb-3">Research Domain (Top 5)</h4>
                   <div className="space-y-2">
                     {loadingDomains ? (<p className="text-sm text-gray-500 italic">Loading domains...</p>)
                      : availableTopDomains.length > 0 ? (availableTopDomains.map(domainName => (
                           <div key={domainName} className="flex items-center">
                             <input type="checkbox" id={`domain-${domainName}`} checked={selectedDomains.includes(domainName)}
                                    onChange={() => handleDomainToggle(domainName)} disabled={loading} /* Disable only during project fetch */
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-2 disabled:opacity-50"/>
                             <label htmlFor={`domain-${domainName}`} className="text-gray-700 capitalize">{domainName.replace('-', ' ')}</label>
                           </div>)))
                      : (<p className="text-sm text-gray-500 italic">No domains available.</p>)}
                   </div>
                 </div>

                 {/* Professor (Full List) */}
                 <div className="mb-6">
                   <h4 className="text-gray-800 font-medium mb-3">Professor</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto"> {/* Scroll added */}
                     {loadingProfessors ? (<p className="text-sm text-gray-500 italic">Loading professors...</p>)
                       : availableProfessors.length > 0 ? availableProfessors.map(professor => (
                        <div key={professor} className="flex items-center">
                           <input type="checkbox" id={`professor-${professor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-2 disabled:opacity-50"
                                  checked={selectedProfessors.includes(professor)}
                                  onChange={() => handleProfessorToggle(professor)} disabled={loading}/>
                           <label htmlFor={`professor-${professor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="ml-2 text-gray-700">{professor}</label>
                         </div>
                       )) : (<p className="text-sm text-gray-500 italic">No professors available.</p>)}
                    </div>
                 </div>

                 {/* Skills (Full List) */}
                 <div className="mb-6">
                   <h4 className="text-gray-800 font-medium mb-3">Skills Required</h4>
                   <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto"> {/* Scroll added */}
                     {loadingSkills ? (<p className="text-sm text-gray-500 italic">Loading skills...</p>)
                       : availableSkills.length > 0 ? availableSkills.map(skill => (
                       <button key={skill} type="button"
                               className={`tag px-3 py-1 rounded-full text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 ${selectedSkills.includes(skill) ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                               onClick={() => handleSkillToggle(skill)} aria-pressed={selectedSkills.includes(skill)} disabled={loading}> {skill} </button>
                       )) : (<p className="text-sm text-gray-500 italic">No skills available.</p>)}
                   </div>
                 </div>

                 {/* Students Needed Slider */}
                 <div className="mb-6">
                    <label htmlFor="students-range" className="text-gray-800 font-medium mb-3 block">Max Students Needed</label>
                    <div className="px-2">
                        <input id="students-range" type="range" min="1" max="10" value={studentsRange}
                               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50"
                               onChange={handleStudentsRangeChange} disabled={isLoadingAnything}/>
                        <div className="flex justify-between text-gray-600 text-sm mt-2"><span>1</span><span className="font-semibold text-purple-700">{studentsRange}</span><span>10+</span></div>
                    </div>
                 </div>
                 {/* Availability Checkbox */}
                 <div className="mb-6">
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
                      <div> <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Projects</h2>
                          <p className="text-gray-600"> {loading ? 'Loading...' : `Showing ${projectsToDisplay.length} projects`} </p>
                      </div>
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
                {loading ? (
                    <div className="text-center py-10"><p className="text-purple-600">Loading projects...</p></div>
                ) : error ? (
                     <div className="text-center py-10 bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
                         <p><strong>Error:</strong> {error}</p> <p>Please try refreshing or clearing filters. Check login status if authentication errors persist.</p>
                     </div>
                ) : (
                     <div className="grid grid-cols-1 gap-6">
                         {projectsToDisplay.length > 0 ? ( projectsToDisplay.map(project => (
                             // --- Project Card component/structure here (remains the same) ---
                             <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden project-card hover:shadow-lg transition-shadow duration-200">
                                {/* ... Card Content ... */}
                                <div className="border-b border-gray-200 p-4 flex justify-between items-center"> {/* Header */}
                                    <span className={`inline-block text-white text-xs font-semibold px-3 py-1 rounded-full ${ /* Domain color logic */
                                         project.domain?.toLowerCase() === 'computer-science' ? 'bg-purple-600' : project.domain?.toLowerCase() === 'engineering' ? 'bg-blue-600' : project.domain?.toLowerCase() === 'biology' ? 'bg-green-600' : project.domain?.toLowerCase() === 'physics' ? 'bg-yellow-600 text-gray-800' : project.domain?.toLowerCase() === 'psychology' ? 'bg-red-600' : project.domain?.toLowerCase() === 'chemistry' ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                                         {project.domain ? project.domain.replace('-', ' ') : 'Uncategorized'}
                                     </span>
                                    <span className="text-gray-500 text-sm">Posted {formatTimeAgo(project.postedDate)}</span>
                                </div>
                                <div className="p-6"> {/* Body */}
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{project.title}</h3>
                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4"> {/* Skills */}
                                        {project.skills?.length > 0 ? project.skills.map(skill => (<span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{skill}</span>)) : <span className="text-xs text-gray-500 italic">No specific skills listed</span>}
                                    </div>
                                    <div className="flex items-center mb-4"> {/* Professor */}
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.professor || 'N A')}&background=random&color=fff&size=36`} alt={`${project.professor || 'Professor'} avatar`} className="rounded-full w-9 h-9 mr-2 border border-gray-200"/>
                                        <span className="ml-2 text-gray-700 font-medium">{project.professor || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100"> {/* Footer */}
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500"><i className="fas fa-users mr-1 text-gray-400"></i> {project.studentsNeeded} Student{project.studentsNeeded !== 1 ? 's' : ''} needed</span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${project.availability === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}> {project.availability === 'Open' ? 'Open' : 'Closed'} </span>
                                        </div>
                                        <a href={`/projects/${project.id}`} className="text-purple-600 hover:text-purple-800 font-medium text-sm group"> Details <i className="fas fa-arrow-right text-xs ml-1 group-hover:translate-x-1 transition-transform"></i> </a>
                                    </div>
                                </div>
                             </div>
                         ))) : ( /* No results message */
                             <div className="text-center py-10 text-gray-500 col-span-full">
                                 <p>No projects match the current filters.</p>
                                 <button onClick={handleClearFilters} className="mt-4 text-purple-600 hover:underline"> Clear filters and try again? </button>
                             </div>
                         )}
                     </div>
                )}
            </div> {/* End Project Results Section */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;