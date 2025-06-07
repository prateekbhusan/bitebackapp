import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'donor', 'receiver', 'volunteer'
  const [profile, setProfile] = useState(null);

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setProfile(null);
  };

  const updateProfile = (profileData) => {
    setProfile(profileData);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userType, 
      profile, 
      login, 
      logout, 
      updateProfile,
      setUserType
    }}>
      {children}
    </UserContext.Provider>
  );
};