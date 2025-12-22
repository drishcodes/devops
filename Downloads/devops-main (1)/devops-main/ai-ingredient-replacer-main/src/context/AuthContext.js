import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check login status and fetch user data if token exists
  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch current user data
        const userData = await getCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
        setError(null);
      } catch (err) {
        console.error('Auth verification failed:', err);
        setError('Session expired. Please login again.');
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('token'); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error('Failed to get user data after login:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      login, 
      logout, 
      user, 
      updateUser,
      loading,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
