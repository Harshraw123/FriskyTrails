// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);   // NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const checkAuth = async () => {
      // Skip /me when we have no token — avoids 401 and "Failed to load resource" in console
      const token = localStorage.getItem('token');
      if (!token || token === 'none') {
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
        }
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/api/v1/user/me');
        const userData = response?.data?.user;

        if (isMounted) {
          if (userData) {
            setUser(userData);
            setIsAdmin(userData?.admin === true);
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        // 401 = invalid/expired token — clear and treat as logged out
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
        }
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAdmin(userData?.admin === true);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/v1/user/logout');
    } catch (error) {
      // Logout error handled silently
    } finally {
      setUser(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
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
