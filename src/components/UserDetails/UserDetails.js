import React, { useState } from 'react';
import api from '../../services/api';

const UserDetails = ({ user, onUserRoleChange, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleRoleUpdate = () => {
    console.log('Atualizando usuário:', user.user_id, 'para role:', selectedRole);
    
    api.put(`/users/${user.user_id}/role`, { role: selectedRole })
      .then(response => {
        console.log('Role atualizada com sucesso:', response.data);
        setIsEditing(false);
        onUserRoleChange(user.user_id, selectedRole);
      })
      .catch(err => {
        console.error('Erro ao atualizar role:', err);
      });
  };

  return (
    <div className="mt-4 p-4 border-4 border-[rgb(180,81,5)] bg-[rgb(255,195,118)] rounded-lg shadow-inner w-full text-center">
      {user ? (
        <>
          <div className="w-24 h-24 mb-4 rounded-full mx-auto">
            <img src={user.photo || '../../images/default.png'} alt={user.username} className="w-full h-full object-fill" />
          </div>
          <p className="font-vt323 text-2xl mb-2">{user.username}</p>
          <div className="p-2 mb-4">
            <p><strong>ID:</strong> {user.user_id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
              <strong>Role:</strong>
              {isEditing ? (
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-36 poppins-semibold border-4 rounded border-[#B45105] bg-[#FFC376] ml-2"
                >
                  <option value="funcionario">Funcionário</option>
                  <option value="admin">Administrador</option>
                  <option value="gerente">Gerente</option>
                </select>
              ) : (
                ` ${user.role}`
              )}
            </p>
          </div>
          <div className="flex justify-center space-x-4 bg-[rgb(255,195,118)] rounded-md w-[30%] mx-auto py-2">
            {isEditing ? (
              <button
                onClick={handleRoleUpdate}
                className="poppins-semibold bg-[#B45105] text-white border-4 border-[#EFBB7F] rounded px-4 py-2 hover:bg-[#EFBB7F] hover:text-[#3E1900] transition-all"
              >
                Salvar
              </button>
            ) : (
              <p className='cursor-pointer' onClick={() => setIsEditing(true)}>
                <i className="fa-solid fa-pen"></i>
              </p>
            )}
            <p className='cursor-pointer' onClick={() => onDelete(user.user_id)}>
              <i className="fa-solid fa-trash"></i>
            </p>
          </div>
        </>
      ) : (
        <>
          <img src="/images/magnifier.png" alt="Not Found" className="w-24 h-24 mx-auto mb-4" />
          <p className="text-red-500 mt-4">Busque por um usuário.</p>
        </>
      )}
    </div>
  );
};

export default UserDetails;
