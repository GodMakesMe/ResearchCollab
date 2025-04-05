import React, { createContext, useState, useEffect } from 'react';
import { getToken, logout } from '../services/authService';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
