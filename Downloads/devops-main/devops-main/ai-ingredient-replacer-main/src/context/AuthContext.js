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

        // Try to fetch current user data from backend
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
          setError(null);
        } catch (backendErr) {
          console.log('Backend unavailable, using offline mode');
          // Backend is not available, use offline mode with user data from localStorage
          const offlineUser = localStorage.getItem('offlineUser');
          if (offlineUser && token) {
            setUser(JSON.parse(offlineUser));
            setIsLoggedIn(true);
            setError(null);
          } else {
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem('token');
          }
        }
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
      // Save user data for offline mode
      localStorage.setItem('offlineUser', JSON.stringify(userData));
    } catch (err) {
      console.error('Backend unavailable, creating offline user session');
      // Create offline user session when backend is not available
      const offlineUserData = {
        _id: 'offline_user',
        fullName: 'Offline User',
        email: 'offline@example.com'
      };
      setUser(offlineUserData);
      localStorage.setItem('offlineUser', JSON.stringify(offlineUserData));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('offlineUser');
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
