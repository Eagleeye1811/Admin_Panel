import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/signup', { email, password });
      const { token: newToken } = response.data;
      login(newToken);
    } catch (error) {
      console.log(error);
      throw new Error('Signup failed. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, signup }}>
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