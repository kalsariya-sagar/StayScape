import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const res = await authService.getCurrentUser();
      if (res && res.isAuthenticated && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const loggedInUser = res?.user || res?.data?.user || res?.data;
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const newUser = res?.user || res?.data?.user || res?.data;
    if (newUser) {
      setUser(newUser);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    await checkAuthStatus();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};