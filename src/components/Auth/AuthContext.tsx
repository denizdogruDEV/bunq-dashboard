import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { bunqApi } from '../../services/bunqApi';
import { User, AuthContextType } from '../../types';

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Export the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if the user is already authenticated
    const sessionToken = localStorage.getItem('bunq_session_token');
    if (sessionToken) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, []);
  
  const fetchUserInfo = async (): Promise<void> => {
    try {
      const userInfo = await bunqApi.getUserInfo();
      setUser(userInfo);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user information');
      setLoading(false);
    }
  };
  
  const login = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await bunqApi.authenticate();
      if (result.success) {
        await fetchUserInfo();
        return true;
      } else {
        setError('Authentication failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('Authentication error');
      setLoading(false);
      return false;
    }
  };
  
  const logout = (): void => {
    bunqApi.logout();
    setUser(null);
  };
  
  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default export (optional)
export default { AuthProvider, useAuth };