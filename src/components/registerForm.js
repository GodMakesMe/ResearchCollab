import React, { useState } from 'react';
import axios from 'axios';

const RegisterRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://researchcollab-backend.up.railway.app/api/auth/register-request',
        formData
      );
      setMessage('Registration request sent. Awaiting admin approval.');
    } catch (err) {
      setMessage('Failed to send registration request.');
    }
  };

  return (
    <div>
      <h2>Request to Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Send Request</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterRequestForm;
