import React, { useEffect, useRef, useState } from 'react';
import { login } from '../services/authServies'; // Adjust path to match your project structure
import { useNavigate } from 'react-router-dom';

// Currently the OAuth error will show as we have not implemented the goodle cloud console due to billing issues which is required to use the google login.


const WebAdminLogin = () => {
  const googleDivRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  const handleGoogleResponse = (response: any) => {
    console.log('Google login response:', response);
    // You can send response.credential to your backend
  };

  const handleNormalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const data = await login(email, password);
      console.log('Login successful:', data);
      setStatus('success');
      navigate('/dashboard'); 

    } catch (err: any) {
      console.error('Login failed:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.google && googleDivRef.current) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(googleDivRef.current, {
        theme: 'outline',
        size: 'large',
      });
    }
  }, []);

  // Dynamic button color
  const getButtonColor = () => {
    if (loading) return '#6c757d'; // gray
    if (status === 'success') return '#28a745'; // green
    if (status === 'error') return '#dc3545'; // red
    return '#007bff'; // default blue
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Web Admin Login</h2>

      <form onSubmit={handleNormalLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.7rem',
            backgroundColor: getButtonColor(),
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          {loading ? 'Logging in...' : status === 'success' ? 'Success!' : status === 'error' ? 'Failed. Try again' : 'Login'}
        </button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <div style={{ textAlign: 'center' }}>
        <div ref={googleDivRef}></div>
      </div>
    </div>
  );
};

export default WebAdminLogin;
