import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState('');

  const login = (nickname) => {
    setIsLoggedIn(true);
    setUserNickname(nickname);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserNickname('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userNickname, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 