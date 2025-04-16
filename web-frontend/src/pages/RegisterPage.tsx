import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import './RegisterPage.css'; // Ensure this file is created with styling similar to your LoginPage.css
import logo from '../assets/Logo_Center.png'; // Adjust the path to your logo
import { register, googleRegister } from '../services/authServies'

// declare global {
//   interface Window {
//     google: typeof google;
//   }

//   const google: {
//     accounts: {
//       id: {
//         initialize: (config: {
//           client_id: string;
//           callback: (response: any) => void;
//         }) => void;
//         renderButton: (
//           parent: HTMLElement,
//           options: {
//             theme: string;
//             size: string;
//           }
//         ) => void;
//         prompt: () => void;
//       };
//     };
//   };
// }

const RegisterPage: React.FC = () => {
  const googleDivRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isNumberValid, setIsNumberValid] = useState(true);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentName(e.target.value);
  };

  const handleGoogleResponse = async (response: any) => {
      // console.log('Google login response:', response);
    
      // 👇 This is where you should extract and send token to your backend
      try {
        const credential = response.credential; // this is a JWT
        const data = await googleRegister(credential); // 🔥 Call your backend with Google token
        console.log('Google registration successful:', data);
    
      //   if (data.role !== 'admin') {
      //     alert('You do not have permission to access this page.');
      //     localStorage.removeItem('token');
      //     setStatus('error');
      //     return;
      //   }
    
        setStatus('success');
        navigate('/');
      }
      catch (err: any) {
        const statusCode = err?.response?.status || err?.status;
        if (statusCode === 401) {
          alert('You are already registered. Please login.');
          navigate('/login');
        }else{
          console.error('Google login failed:', err);
          setStatus('error');
        }
      }
    };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(emailRegex.test(e.target.value));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers (or you might want to allow a + sign and spaces based on your requirements)
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setNumber(value);
      setIsNumberValid(value !== '');
    }
  };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  // const handleForgotPassword = () => setForgotPasswordModal(true);
  const closeForgotPasswordModal = () => setForgotPasswordModal(false);

  // const handleResetPassword = () => {
  //   alert(`Password reset link sent to ${email}`);
  //   closeForgotPasswordModal();
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form fields
    if (!isEmailValid) {
      alert('Please enter a valid email address.');
      return;
    }
    
    if (!isNumberValid || number === '') {
      alert('Please enter a valid number.');
      return;
    }
    
    if (studentName.trim() === '') {
      alert('Please enter your name.');
      return;
    }
    // try{
    //   const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/; // At least 6 characters, at least one letter and one number
    //   if (!regex.test(password)) {
    //     alert('Password must be at least 6 characters long and contain at least one letter and one number.');
    //     return;
    //   }
    // }catch(err){
    //   console.error('Error validating password:', err);
    //   alert('Invalid password format.');
    //   return;
    // }
    // If all validations pass, proceed with registration
    try{
      const data = await register(studentName, email, number, 'student', password);
      console.log('Registration data:', { studentName, email, number });
      alert('Registration request has been sent to admin. You will be informed when approved. Try Again Later, Contact Admin in case of delay');
    }catch(err: any){
      const statusCode = err?.response?.status || err?.status;
      if (statusCode === 401) {
        alert('You are already registered. Please login.');
        navigate('/login');
      }else{
        console.error('Registration failed:', err);
        setStatus('error');
      }
    }
    // Optionally, you can reset the form fields after successful registration

    // Optionally navigate to login page or any other page after successful submission.
    // navigate('/login');
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

   useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id && googleDivRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: '772822804133-opg9mba69tr4rb24bbvurfigqf68kqup.apps.googleusercontent.com',
          callback: handleGoogleResponse,
        });
  
        window.google.accounts.id.renderButton(
          googleDivRef.current,
          {
            theme: 'outline',
            size: 'large', 
            type: 'standard',
            shape: 'rectangular',
            text: 'signup_with',
          } as any
        );
      } catch (error) {
          console.error("Error initializing or rendering Google button:", error);
      }
    } else {
        console.warn("Google Identity Services script not loaded yet or ref not ready.");
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

        <h2 className="title">Student Registration</h2>
        <p className="subtitle">Register to join Research Collab</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Student Name</label>
          <input
            type="text"
            value={studentName}
            onChange={handleNameChange}
            placeholder="Enter your full name"
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="youremail@university.edu"
            required
          />
          {!isEmailValid && <span className="error">Invalid email format</span>}

          <label>Phone Number</label>
          <input
            type="text"
            value={number}
            onChange={handleNumberChange}
            placeholder="Enter your phone number"
            required
          />
          {!isNumberValid && <span className="error">Invalid phone number</span>}

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
          </div>

          
          <button type="submit" className="submit-btn" onClick={handleSubmit}>Register</button>
          <div style={{ textAlign: 'center' , padding: '1rem' ,display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px'}}>
            <div ref={googleDivRef}></div>
          </div>

        </form>

        <p className="signup-text">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;