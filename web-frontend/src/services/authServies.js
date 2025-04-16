import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {backend_url} from '../utils/constants.js';
const API_URL = `${backend_url}/api/auth`;

export const register = async (name, email, phone, role, password) => {
    return await axios.post(`${API_URL}/register-request`, { name, email, phone, role, password });
};


export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (response.data.token) {
        const token = response.data.token;
        const decoded = jwtDecode(token.split(' ')[1]);

        const role = decoded.role;
        // Store both token and role in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        return { success: true, role }; // Return the role to caller
    }

    return { success: false };
};

// api.ts or authService.ts
export const googleLogin = async (googleToken) => {
    console.log('BACKEND URL:', backend_url);  // Must print 'http://localhost:8080'

    console.log('Google token Inside authService.js:', googleToken);
    try {
        const response = await axios.post(`${API_URL}/google-login`, { token: googleToken });
        console.log('Google login response:', response);
        
        if (response.data.token) {
        const token = response.data.token;
        const decoded = jwtDecode(token.split(' ')[1]);
    
        const role = decoded.role;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    
        return { success: true, role };
        }
        if (response.credential){
            const token = response.credential;
        const decoded = jwtDecode(token.split(' ')[1]);
    
        const role = decoded.role;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
    
        return { success: true, role };
        }
    
        return { success: false };
    }
    catch (error) {
        console.error('Google login error:', error);
        return { success: false };
    }
  };
  
export const googleRegister = async (googleToken) => {
    console.log('Google token Inside authService.js:', googleToken);
    try {
        const response = await axios.post(`${API_URL}/google-register`, { token: googleToken });
        console.log('Google register response:', response);
        
        if (response.data.token) {
            const token = response.data.token;
            const decoded = jwtDecode(token.split(' ')[1]);
    
            const role = decoded.role;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
    
            return { success: true, role };
        }
    
        return { success: false };
    }
    catch (error) {
        console.error('Google register error:', error);
        return { success: false };
    }
}

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');
