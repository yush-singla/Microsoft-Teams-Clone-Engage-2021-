import React, { createContext, useContext, useState } from "react";

const LoginContext = createContext();

export function useLogin() {
  return useContext(LoginContext);
}

export default function LoginProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return <LoginContext.Provider value={[isLoggedIn, setIsLoggedIn]}>{children}</LoginContext.Provider>;
}
