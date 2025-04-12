// App.tsx or Routes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebAdmin from './pages/webAdminLogin'; // adjust import path as needed
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WebAdmin />} />
        <Route path="/dashboard/" element={<Dashboard/>} />
        {/* <Route path="/user-requests" element={<UserRequests />} />
        <Route path="/faculty-requests" element={<FacultyRequests />} />   */}
        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default App;
