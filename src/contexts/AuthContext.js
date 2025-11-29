import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('USER_DATA');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const storedUser = await AsyncStorage.getItem('USER_DATA');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.email === email && userData.password === password) {
          setUser(userData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const userData = { name, email, password };
      await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('USER_DATA');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
