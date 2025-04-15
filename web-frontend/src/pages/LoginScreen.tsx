import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS
import logo from '../assets/Logo_Center.png'; // Adjust the path to your logo
import { googleLogin, login } from '../services/authServies'

// Extend the Window interface to include the google property
declare global {
    interface Window {
      google: typeof google;
    }
  
    const google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme: string;
              size: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }

  
const LoginPage: React.FC = () => {
  const googleDivRef = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleGoogleResponse = async (response: any) => {
    // console.log('Google login response:', response);
  
    // 👇 This is where you should extract and send token to your backend
    try {
      const credential = response.credential; // this is a JWT
      const data = await googleLogin(credential); // 🔥 Call your backend with Google token
      console.log('Google login successful:', data);
  
    //   if (data.role !== 'admin') {
    //     alert('You do not have permission to access this page.');
    //     localStorage.removeItem('token');
    //     setStatus('error');
    //     return;
    //   }
  
      setStatus('success');
      navigate('/');
    } catch (err) {
      console.error('Google login failed:', err);
      setStatus('error');
    }
  };

  const evaluatePasswordStrength = (password: string) => {
    if (password.length < 6) setPasswordStrength('weak');
    else if (password.length < 10) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    evaluatePasswordStrength(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(regex.test(e.target.value));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleForgotPassword = () => setForgotPasswordModal(true);
  const closeForgotPasswordModal = () => setForgotPasswordModal(false);

  const handleResetPassword = () => {
    alert(`Password reset link sent to ${email}`);
    closeForgotPasswordModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      alert('Please enter a valid email');
      return;
    }
    alert('Logged in successfully');
  };

  useEffect(() => {
    if (window.google && googleDivRef.current) {
      window.google.accounts.id.initialize({
        client_id: '772822804133-opg9mba69tr4rb24bbvurfigqf68kqup.apps.googleusercontent.com',
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(googleDivRef.current, {
        theme: 'outline',
        size: 'large',
      });
    }
  }, []);

  return (
   
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
            <div style={{ marginBottom: '0rem' }}>
                    <img src={logo} alt="Logo" style={{ width: '400px', height: 'auto', marginBottom: '0.5rem' }} />
            </div>
        </div>

        <h2 className="title">Welcome to Research Collab</h2>
        <p className="subtitle">Common Log in Platform</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="youremail@university.edu"
            required
          />
          {!isEmailValid && <span className="error">Invalid email format</span>}

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
            />
            <span onClick={togglePasswordVisibility} className="toggle-password">
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          <div className={`strength-bar ${passwordStrength}`}></div>

          <div className="form-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" className="link-button" onClick={handleForgotPassword}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="submit-btn">Log In</button>
        </form>
        <div style={{ textAlign: 'center' , padding: '1rem' ,display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px'}}>
            <div ref={googleDivRef}></div>
        </div>

        <p className="signup-text">
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </div>

      {forgotPasswordModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
            />
            <button onClick={handleResetPassword} className="submit-btn">Reset Password</button>
            <button onClick={closeForgotPasswordModal} className="link-button">Close</button>
          </div>
        </div>
      )}
      
    </div>

  );
};

export default LoginPage;
