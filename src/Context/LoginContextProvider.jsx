import React, { createContext, useState } from "react";

export const LoginContext = createContext();

export const LoginContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <LoginContext.Provider value={{ state: [isLoggedIn, setIsLoggedIn] }}>
      {children}
    </LoginContext.Provider>
  );
};
