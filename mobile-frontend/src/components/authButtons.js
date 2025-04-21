import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login, logout } from '../services/authService';

const AuthButtons = () => {
    const { user } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            await login('johndoe@example.com', 'securepassword');
            window.location.reload(); 
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    return (
        <div>
            {user ? (
                <button onClick={() => { logout(); window.location.reload(); }}>Logout</button>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}
        </div>
    );
};

export default AuthButtons;
