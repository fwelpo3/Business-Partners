
import { useState, useEffect, useCallback } from 'react';

const PASSWORD_KEY = 'business_directory_password';

// In a real app, never store passwords in plaintext. Use a robust hashing library like bcrypt.
// This is a simplified approach for demonstration purposes.

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedPassword = localStorage.getItem(PASSWORD_KEY);
      if (storedPassword) {
        setPassword(storedPassword);
      }
    } catch (error) {
      console.error('Failed to load password from localStorage', error);
    }
  }, []);
  
  const hasPassword = !!password;

  const login = useCallback((attempt: string): boolean => {
    if (password && attempt === password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [password]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const createPassword = useCallback((newPassword: string) => {
    try {
      localStorage.setItem(PASSWORD_KEY, newPassword);
      setPassword(newPassword);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to save password to localStorage', error);
      throw new Error('Could not set password.');
    }
  }, []);

  const changePassword = useCallback((currentAttempt: string, newPassword: string): boolean => {
    if (password && currentAttempt === password) {
       try {
        localStorage.setItem(PASSWORD_KEY, newPassword);
        setPassword(newPassword);
        return true;
      } catch (error) {
        console.error('Failed to save new password to localStorage', error);
        throw new Error('Could not change password.');
      }
    }
    return false;
  }, [password]);

  return { 
    isAuthenticated,
    hasPassword, 
    login, 
    logout, 
    createPassword,
    changePassword
  };
};
