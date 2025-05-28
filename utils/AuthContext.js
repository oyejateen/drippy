import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChangedListener, getCurrentUser } from './authService';

// Create the auth context
export const AuthContext = createContext({
  currentUser: null,
  isLoading: true,
  setCurrentUser: () => null,
});

// Provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 