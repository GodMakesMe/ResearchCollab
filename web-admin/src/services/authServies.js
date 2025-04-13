import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API_URL = 'https://researchcollab-backend.up.railway.app/api/auth'; // Change to Railway URL in production

export const register = async (name, email, phone, role, password) => {
    return await axios.post(`${API_URL}/register`, { name, email, phone, role, password });
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


export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');
