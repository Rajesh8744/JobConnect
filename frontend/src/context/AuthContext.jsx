import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) setUser(JSON.parse(storedUser));
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await axiosInstance.post('/auth/login', { email, password });
        const data = res.data;
        localStorage.setItem('token', data.accessToken);
        const userData = { id: data.id, email: data.email, fullName: data.fullName, role: data.role };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const register = async (fullName, email, password, role = 'SEEKER', companyName = '', phone = '') => {
        await axiosInstance.post('/auth/register', { fullName, email, password, role, companyName, phone });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-950 text-white">Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
