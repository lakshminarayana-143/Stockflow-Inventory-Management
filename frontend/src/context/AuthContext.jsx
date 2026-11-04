import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = useCallback(async () => {
    const token = localStorage.getItem('stockflow_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        setOrganization(res.data.organization);
      } else {
        localStorage.removeItem('stockflow_token');
      }
    } catch (err) {
      console.warn('Session verification failed, logging out:', err.message);
      localStorage.removeItem('stockflow_token');
      setUser(null);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      localStorage.setItem('stockflow_token', res.data.token);
      setUser(res.data.user);
      setOrganization(res.data.organization);
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const signup = async (payload) => {
    const res = await authService.signup(payload);
    if (res.success && res.data) {
      localStorage.setItem('stockflow_token', res.data.token);
      setUser(res.data.user);
      setOrganization(res.data.organization);
      return res.data;
    }
    throw new Error(res.message || 'Signup failed');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Continue even if network fails
    } finally {
      localStorage.removeItem('stockflow_token');
      setUser(null);
      setOrganization(null);
    }
  };

  const updateOrganizationState = (updatedOrg) => {
    setOrganization((prev) => ({ ...prev, ...updatedOrg }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateOrganizationState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
