import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar/SearchBar';
import UserDetails from '../components/UserDetails/UserDetails';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Carregar todos os usuários ao carregar a página
  useEffect(() => {
    axios.get('http://localhost:3001/api/users') // Alterar para a URL correta do back-end
      .then(response => {
        setUsers(response.data); // Definir os usuários vindos do back-end
      })
      .catch(() => {
        setError('Erro ao buscar usuários');
      });
  }, []);

  const handleSearch = (query) => {
    const foundUser = users.find(u => u.username.toLowerCase() === query.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      setError('');
    } else {
      setUser(null);
      setError('Usuário não encontrado!');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Navbar */}
      <nav className="w-1/7 bg-[rgb(107,55,16)] text-white p-4 flex flex-col items-center">
        <img src="/images/icone.png" alt="Pergaminho" className="w-16 h-16 mb-4" />
        <p className="text-center mb-4">Auditoria de usuários</p>
        <button className="vt323-regular bg-[rgb(62,25,0)] w-28 text-[rgb(244,189,118)] border-4 border-black rounded px-4 py-2 mt-4">
          Voltar
        </button>
        <img src="/images/icone.png" alt="Ícone do Projeto" className="w-8 h-8 mt-auto" />
      </nav>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex justify-center items-center bg-brorange-800">
        <div className="flex border-4 border-[rgb(107,55,16)] h-5/6 w-1/2 bg-[rgb(255,195,118)]">
          <section className="border-4 border-[rgb(180,81,5)] h-full w-full shadow-inner p-4">
            <SearchBar onSearch={handleSearch} />
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <UserDetails user={user} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
