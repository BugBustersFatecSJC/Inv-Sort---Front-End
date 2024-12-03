import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SearchBar from '../../components/SearchBar/SearchBar';
import UserDetails from '../../components/UserDetails/UserDetails';
import MainPage from '../../pages/MainPage/MainPage';
import FlashMessage from '../../components/FlashMessage/FlashMessage'; // Importa o FlashMessage corretamente

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', role: 'funcionario' });
  const [error, setError] = useState('');
  const [flash, setFlash] = useState(null); // Estado para mensagem flash

  const fetchUsers = () => {
    api.get('/users')
      .then(response => {
        setUsers(response.data);
        setUser(null);
      })
      .catch(() => {
        setError('Erro ao buscar usuários');
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setError('Digite um nome de usuário');
      setUser(null);
      return;
    }

    const foundUser = users.find(u => u.username.toLowerCase() === query.toLowerCase().trim());
    if (foundUser) {
      setUser(foundUser);
      setError('');
    } else {
      setUser(null);
      setError('Usuário não encontrado!');
    }
  };

  const handleDelete = (userId) => {
    api.delete(`/users/${userId}`)
      .then(() => {
        setUsers(users.filter(u => u.user_id !== userId));
        if (user && user.user_id === userId) setUser(null);
        setFlash({ message: 'Usuário deletado com sucesso!', type: 'success' });
        setTimeout(() => setFlash(null), 3000);
      })
      .catch(err => {
        setError('Erro ao deletar usuário');
        setFlash({ message: 'Erro ao deletar usuário.', type: 'error' });
      });
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => user.user_id === userId ? { ...user, role: newRole } : user));
  };

  const handleAddUser = () => {
    const { username, email, role } = newUser;
    const password = "123"; // Senha padrão

    if (!username.trim() || !email.trim()) {
      setError('Preencha todos os campos do novo usuário');
      return;
    }

    api.post('/users', { username, email, password, role })
      .then(response => {
        setUsers([...users, response.data]);
        setNewUser({ username: '', email: '', role: 'funcionario' });
        setFlash({ message: 'Usuário adicionado com sucesso!', type: 'success' });
        setTimeout(() => setFlash(null), 3000);
        setError('');
      })
      .catch((error) => {
        setError('Erro ao adicionar usuário');
        setFlash({ message: 'Erro ao adicionar usuário.', type: 'error' });
      });
  };

  return (
    <MainPage title="Gerencie usuários">
      <div className="flex-1 flex justify-center items-center ">
        <div className="flex border-4 border-[rgb(107,55,16)] h-5/6 w-1/2 bg-[rgb(255,195,118)]">
          <section className="border-4 border-[rgb(180,81,5)] h-full w-full shadow-inner p-4">
            {flash && (
              <FlashMessage
                message={flash.message}
                type={flash.type}
                duration={3000}
                onClose={() => setFlash(null)}
              />
            )}
            <div className='flex justify-between'>
              <SearchBar onSearch={handleSearch} />
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
  
            <div className="flex mt-4 flex-col">
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-lg mb-2 bg-[#6B3710] text-[#FFC376] poppins-semibold"
                placeholder="Nome de Usuário"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
              <input
                type="email"
                className="p-2 border border-gray-300 rounded-lg mb-2 bg-[#6B3710] text-[#FFC376] poppins-semibold"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <select
                className="p-2 border border-gray-300 rounded-lg mb-2 bg-[#6B3710] text-[#FFC376] poppins-semibold"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="funcionario">Funcionário</option>
                <option value="admin">Administrador</option>
                <option value="gerente">Gerente</option>
              </select>
              <button onClick={handleAddUser} className="poppins-semibold bg-[#6B3710] text-[#FFC376] hover:bg-[#C17B46] hover:text-[#3E1900] transition-all rounded-lg px-4 py-2">
                Adicionar Usuário
              </button>
            </div>
  
            {user ? (
              <UserDetails
                user={user}
                onUserRoleChange={handleRoleChange}
                onDelete={handleDelete}
              />
            ) : (
              users.map(user => (
                <UserDetails
                  key={user.user_id}
                  user={user}
                  onUserRoleChange={handleRoleChange}
                  onDelete={handleDelete}
                />
              ))
            )}
          </section>
        </div>
      </div>
    </MainPage>
  );
}
export default UserPage;