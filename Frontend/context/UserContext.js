// UserContext.js (Create a new file)
import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState(null);

  const updateUser = (user) => {
    setUserName(user.username);
    setUserEmail(user.email);
    setUserData(user);
  };

  return (
    <UserContext.Provider value={{ userName, userEmail, userData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);