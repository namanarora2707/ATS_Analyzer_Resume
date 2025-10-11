import React, { createContext, useContext, useState, useEffect } from 'react';
import { createAuthResponse } from '@shared/api.js';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user && data.token) {
        setUser(data.user);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return createAuthResponse(false, null, null, 'Network error. Please try again.');
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success && data.user && data.token) {
        setUser(data.user);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      return createAuthResponse(false, null, null, 'Network error. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
