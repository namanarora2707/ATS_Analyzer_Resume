import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const login = async (username, password) => {
    try {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // Backend returns { message: 'Login Successful', data: user, token }
      if (response.ok && data && data.token) {
        const user = data.data || data.user || null;
        setUser(user);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user, token: data.token, message: data.message };
      }

      return { success: false, user: null, token: null, message: data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, user: null, token: null, message: 'Network error. Please try again.' };
    }
  };

  const signup = async (username, password) => {
    try {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/v1/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // Backend returns { message: 'User Created Successfully', newUser }
      if (response.ok && data) {
        const user = data.newUser || data.user || null;
        // NOTE: backend may not return a token on signup; only set user if provided
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
        }
        return { success: true, user, token: data.token || null, message: data.message };
      }

      return { success: false, user: null, token: null, message: data.message || 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, user: null, token: null, message: 'Network error. Please try again.' };
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
