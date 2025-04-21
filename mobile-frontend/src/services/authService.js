import axios from 'axios';

const API_URL = 'https://researchcollab-backend.up.railway.app/api/auth'; // Change to Railway URL in production

export const register = async (name, email, phone, role, password) => {
    return await axios.post(`${API_URL}/register`, { name, email, phone, role, password });
};

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');
