import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Check if user is already logged in
        const storedAgent = localStorage.getItem('agent');
        const storedToken = localStorage.getItem('token');

        if (storedAgent && storedToken) {
            setAgent(JSON.parse(storedAgent));
            setToken(storedToken);
            connectSocket();
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { data, token } = response.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('agent', JSON.stringify(data));

            setAgent(data);
            setToken(token);

            // Connect to Socket.IO
            connectSocket();

            return { success: true, agent: data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('agent');
        setAgent(null);
        setToken(null);
        disconnectSocket();
    };

    const value = {
        agent,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!agent && !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
