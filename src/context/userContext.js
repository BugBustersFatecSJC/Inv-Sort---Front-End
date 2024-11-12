import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedRememberMe = localStorage.getItem("rememberMe") === 'true';

  const [user, setUser] = useState(storedUser || null);
  const [role, setRole] = useState(storedUser ? storedUser.role : "funcionario");

  useEffect(() => {
    if (user && storedRememberMe) {
      // Apenas persiste no localStorage se "Lembrar-me" for true
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // Remove o storage mais a frente em todas as condições de limpeza
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
    }
  }, [user, storedRememberMe]);

  return (
    <UserContext.Provider value={{ user, setUser, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};