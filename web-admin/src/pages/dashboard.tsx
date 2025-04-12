import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/tiger_head_generated.jpg'; // Adjust the path as necessary
import ViewUsers from '../adminOptions/ViewUsers';
import ViewFaculty from '../adminOptions/ViewFaculty';
import ViewProjects from '../adminOptions/ViewProjects';

// import AddUsers from '../adminOptions/AddUsers';
// import AddFaculty from '../adminOptions/AddFaculty';
// import AddProjectDetails from '../adminOptions/AddProjectDetails';

// import EditUsers from '../adminOptions/EditUsers';
// import EditFaculty from '../adminOptions/EditFaculty';
// import EditProjects from '../adminOptions/EditProjects';

// import AnalyticsOverview from '../adminOptions/AnalyticsOverview';
// import AnalyticsTrends from '../adminOptions/AnalyticsTrends';

// import FundingGrants from '../adminOptions/FundingGrants';
// import FundingDonations from '../adminOptions/FundingDonations';

// import PendingUserRequests from '../adminOptions/PendingUserRequests';
// import PendingFacultyRequests from '../adminOptions/PendingFacultyRequests';

// import Settings from '../adminOptions/Settings';
// import Logs from '../adminOptions/Logs';

const menuStructure = [
  {
    label: 'View Data',
    children: ['Users', 'Faculty', 'Projects'],
  },
  {
    label: 'Add Data',
    children: ['Users', 'Faculty', 'Project Details'],
  },
  {
    label: 'Edit Data',
    children: ['Users', 'Faculty', 'Projects'],
  },
  {
    label: 'Analytics Page',
    children: ['Overview', 'Trends'],
  },
  {
    label: 'Funding',
    children: ['Grants', 'Donations'],
  },
  {
    label: 'Pending Requests',
    children: ['User Requests', 'Faculty Requests'],
  },
  {
    label: 'Others',
    children: ['Settings', 'Logs'],
  },
];

const AdminDashboard = () => {
  const [expandedTab, setExpandedTab] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleExpand = (label: string) => {
    setExpandedTab(expandedTab === label ? null : label);
  };

  const handleSelect = (label: string, child: string) => {
    setSelectedChild(`${label} > ${child}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const renderContent = () => {
    switch (selectedChild) {
      // View Data
      case 'View Data > Users':
        return <ViewUsers />;
      case 'View Data > Faculty':
        return <ViewFaculty />;
      case 'View Data > Projects':
        return <ViewProjects />;
  
      // // Add Data
      // case 'Add Data > Users':
      //   return <AddUsers />;
      // case 'Add Data > Faculty':
      //   return <AddFaculty />;
      // case 'Add Data > Project Details':
      //   return <AddProjectDetails />;
  
      // // Edit Data
      // case 'Edit Data > Users':
      //   return <EditUsers />;
      // case 'Edit Data > Faculty':
      //   return <EditFaculty />;
      // case 'Edit Data > Projects':
      //   return <EditProjects />;
  
      // // Analytics Page
      // case 'Analytics Page > Overview':
      //   return <AnalyticsOverview />;
      // case 'Analytics Page > Trends':
      //   return <AnalyticsTrends />;
  
      // // Funding
      // case 'Funding > Grants':
      //   return <FundingGrants />;
      // case 'Funding > Donations':
      //   return <FundingDonations />;
  
      // // Pending Requests
      // case 'Pending Requests > User Requests':
      //   return <PendingUserRequests />;
      // case 'Pending Requests > Faculty Requests':
      //   return <PendingFacultyRequests />;
  
      // // Others
      // case 'Others > Settings':
      //   return <Settings />;
      // case 'Others > Logs':
      //   return <Logs />;
  
      default:
        return <div>Welcome to Admin Dashboard</div>;
    }
  };

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

  return (
    
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Bar */}
      {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#007bff', color: 'white', padding: '1rem' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setSelectedChild(null)}>
          🧪 ResearchCollab Admin
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div>Analytics</div>
          <div>Notifications</div>
          <div>Profile</div>
        </div>
      </div> */}

      {/* Body */}
      
        <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ 
            width: '250px', 
            padding: '1rem', 
            paddingTop: '2rem', 
            borderRight: 'none', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
            }}>
            <div>
                {/* Logo */}
                <div style={{ marginBottom: '0rem', display: 'flex', justifyContent: 'center' }}>
                <img src={logo} alt="Logo" style={{ width: 'auto', height: '80px', marginBottom: '0.5rem' }} />
                </div>

                {/* Title */}
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#111111' }}>ResearchCollab</h2>
                </div>

                {/* Sidebar Menu */}
                <div>
                {menuStructure.map(({ label, children }) => (
                    <div key={label} style={{ marginBottom: '0.5rem' }}>
                        <button
                        style={{
                            width: '100%',
                            padding: '0.9rem',
                            fontWeight: 'bold',
                            textAlign: 'left',
                            backgroundColor: expandedTab === label ? '#add' : 'transparent',
                            cursor: 'pointer',
                            opacity: '1',
                            color: '#0f6f6f',
                            borderRadius: '8px',
                            border: '1px solid #ccc'
                        }}
                        onClick={() => handleExpand(label)}
                        >
                        {label}
                        </button>

                        {expandedTab === label && (
                        <div style={{ paddingLeft: '1rem', marginTop: '0.5rem', borderRadius: '5px' }}>
                            {children.map((child) => {
                            const fullPath = `${label} > ${child}`;
                            return (
                                <button
                                key={child}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    textAlign: 'left',
                                    backgroundColor: selectedChild === fullPath ? '#add' : 'transparent',
                                    border: 'none',
                                    borderRadius: '5px',
                                    color: selectedChild === fullPath ? '#0f6f6f' : '#999999',
                                    marginBottom: '0.5rem',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleSelect(label, child)}
                                >
                                {child}
                                </button>
                            );
                            })}
                        </div>
                        )}
                    </div>
                    ))}

                </div>
            </div>

            {/* Logout Button */}
            <div>
                <button
                onClick={handleLogout}
                style={{
                    padding: '0.5rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    width: '100%'
                }}
                >
                Logout
                </button>
            </div>
        </div>

        

        {/* Dashboard Area */}
        {/* Dashboard Area */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', borderTopLeftRadius: '60px', borderTopRightRadius: '20px', backgroundColor: '#f8f9fa' }}>
        <div style={{ padding: '1.5rem', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{selectedChild || 'Welcome to Admin Dashboard'}</h2>
            <div>
            {renderContent()}
            </div>
        </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;