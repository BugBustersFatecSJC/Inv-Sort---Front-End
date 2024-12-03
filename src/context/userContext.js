import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const storedUser = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user"));
  const storedRememberMe = localStorage.getItem("rememberMe") === 'true';

  const [user, setUser] = useState(storedUser || null);
  const [role, setRole] = useState(storedUser ? storedUser.role : 'funcionario');
  const [needsRegistration, setNeedsRegistration] = useState(false);

  /**
   * Verifica no backend se é necessário criar o administrador inicial.
   */
  useEffect(() => {
    const checkFirstLogin = async () => {
      try {
        const response = await api.get('/check-login');
        setNeedsRegistration(response.data.needsRegistration);
      } catch (error) {
        console.error('Erro ao verificar primeiro login:', error);
      }
    };

    checkFirstLogin();
  }, []);

  /**
   * Gerencia o armazenamento do usuário no localStorage.
   * Apenas salva no localStorage se "Lembrar-me" for verdadeiro.
   */
  useEffect(() => {
    if (user) {
      if (storedRememberMe) {
        // Salva no localStorage se "Lembrar-me" for true
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("rememberMe", 'true');
      } else {
        // Salva no sessionStorage se "Lembrar-me" for false
        sessionStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("rememberMe");
      }
    } else {
      // Remove os dados de autenticação ao deslogar
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      sessionStorage.removeItem("user");
    }
  }, [user, storedRememberMe]);

  /**
   * Atualiza o estado de needsRegistration após o cadastro inicial.
   */
  const updateNeedsRegistration = (status) => {
    setNeedsRegistration(status);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        role,
        setRole,
        needsRegistration,
        setNeedsRegistration: updateNeedsRegistration,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
