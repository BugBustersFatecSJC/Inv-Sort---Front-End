import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfileIcon() {
  const navigate = useNavigate();

  const navigateUserProfile = () => {
    navigate('/profile');
  };

  // Obtendo o usuário do localStorage com verificações de segurança
  const user = localStorage.getItem("user");
  let jsonUser = null;

  try {
    jsonUser = user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Invalid user JSON:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  }

  if (!jsonUser) {
    // Renderize um estado padrão quando jsonUser não está disponível
    return <div>Usuário não autenticado</div>;
  }

  return (
    <div className='flex items-center'>

      <div className='me-3 flex flex-col justify-end text-end mr-4'> 
        <p className='poppins-medium text-xl'>
          {jsonUser.username}
        </p>
        <p className='poppins-medium '>
          {jsonUser.role}
        </p>

      </div>

      <figure className='bg-white rounded-full w-[4.4rem] h-[4.4rem] cursor-pointer' onClick={navigateUserProfile}>
        {jsonUser.user_img && (
          <img
            src={`http://localhost:3001${jsonUser.user_img}`}
            className="w-full h-full rounded-full"
            alt="imagem do usuário"
          />
        )}
      </figure>
    </div>
  );
}

export default UserProfileIcon;
