import React, { useState } from 'react';
import axios from 'axios';
import { backend_url } from '../utils/constants';

const AddFaculty: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    department: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const endpoint = `${backend_url}/faculty/add`;

      await axios.post(endpoint, formData, {
        headers: { Authorization: `${token}` },
      });

      alert('✔ Faculty added successfully');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        department: '',
      });
    } catch (error) {
      alert('❌ Failed to add faculty');
      console.error(error);
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '2rem' }}>
      <h3 style={{
        fontSize: '1.8rem',
        fontWeight: 600,
        marginBottom: '1.5rem',
        color: '#0f6f6f',
      }}>
        Add New Faculty
      </h3>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        maxWidth: '600px',
        margin: 'auto',
      }}>
        <div style={fieldWrapper}>
          <label style={labelStyle}>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required />
        </div>

        <div style={fieldWrapper}>
          <label style={labelStyle}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
        </div>

        <div style={fieldWrapper}>
          <label style={labelStyle}>Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldWrapper}>
          <label style={labelStyle}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldWrapper}>
          <label style={labelStyle}>Department</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} style={inputStyle} required />
        </div>

        <button type="submit" style={buttonStyle}>
          ➕ Add Faculty
        </button>
      </form>
    </div>
  );
};

const fieldWrapper: React.CSSProperties = {
  marginBottom: '1rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.4rem',
  fontWeight: 600,
  color: '#333',
};

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  width: '100%',
  fontSize: '1rem',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.8rem 1.5rem',
  backgroundColor: '#0f6f6f',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1rem',
  marginTop: '1rem',
};

export default AddFaculty;
