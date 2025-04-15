import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import LoginPage from './pages/LoginScreen';
import Profile from './pages/Profile';
import ProjectDetail from './pages/ProjectDetail'; // Import Profile page
import StudentDashboard from './pages/StudentDashboard'; // Import Student Dashboard page
import FacultyDashboard from './pages/FacultyDashboard'; // Import Faculty Dashboard page
import NewsFeed from './pages/NewsFeed';
import ResearchPapersPage from './pages/ResearchPapersPage';
// import WebAdmin from './pages/webAdminLogin'; // Uncomment if needed
// import DashboardScreen from './pages/StudentDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
        <Route path="/project/:id" element={<ProjectDetail />} /> {/* Dedicated project page */}
        <Route path="/dashboard" element={<StudentDashboard/>} /> {/* Student dashboard route */}
        <Route path="/faculty-dashboard" element={<FacultyDashboard/>} /> {/* Faculty dashboard route */}
        <Route path="/newsfeed" element={<NewsFeed />} /> {/* News feed route */}
        <Route path="/research-papers" element={<ResearchPapersPage />} /> {/* Research papers route */}
        {/* Add other routes as needed */}
        {/* <Route path="/web-admin" element={<WebAdmin />} /> Uncomment if needed */}
        {/* <Route path="/dashboard" element={<DashboardScreen />} /> Uncomment if needed */}
      </Routes>
    </Router>
  );
};

export default App;
