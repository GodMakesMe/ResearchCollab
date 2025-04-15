import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    role: 'Student',
    phone: '+1 234 567 8901',
    institution: 'XYZ University',
    department: 'Computer Science',
    interests: 'AI, Machine Learning, Data Science',
    bio: 'Passionate about AI and machine learning. Looking to collaborate on impactful research.',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Token not found, redirecting to login...');
      navigate('/login');
    }

    // fetch user data logic here
  }, [navigate]);

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Navigation />

      {/* Profile Header */}
      <section className="bg-purple-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-purple-200 text-lg">Manage your account and research collaborations</p>
        </div>
      </section>

      {/* Profile Info */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Basic Info */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-600 font-medium block mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-600 font-medium block mb-2">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-600 font-medium block mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={userData.phone}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-600 font-medium block mb-2">Role</label>
                  <input
                    type="text"
                    value={userData.role}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Academic & Research Info */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Academic & Research</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-600 font-medium block mb-2">Institution</label>
                  <input
                    type="text"
                    value={userData.institution}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-600 font-medium block mb-2">Department</label>
                  <input
                    type="text"
                    value={userData.department}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-600 font-medium block mb-2">Research Interests</label>
                  <input
                    type="text"
                    value={userData.interests}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Bio</h2>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                rows={4}
                value={userData.bio}
                disabled
              />
            </div>

            <button className="bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-900 transition duration-200">
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* Associated Projects */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example cards — replace with dynamic loading later */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">AI for Healthcare</h3>
              <p className="text-gray-600">Developing AI models to assist in early diagnosis.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Smart Campus IoT</h3>
              <p className="text-gray-600">A system for monitoring and optimizing campus energy usage.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;
