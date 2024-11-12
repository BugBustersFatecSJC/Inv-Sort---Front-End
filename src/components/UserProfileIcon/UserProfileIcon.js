import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext'; // Pegando o contexto do usuário

function UserProfileIcon() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const navigateUserProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');  // Remove do localStorage
    setUser(null);  // Também atualiza o estado do contexto
    navigate('/login');  // Redireciona para login
  };

  // Não depende mais apenas de localStorage para exibir; usa Contexto
  if (!user) {
    return null;
  }

  return (
    <div className='flex items-center'>

      <div className='me-3 flex flex-col justify-end text-end mr-4'> 
        <p className='poppins-medium text-xl'>
          {user.username}

        </p>
        <div className="flex justify-between">
          <p className='font-pixel text-lg'>
            {user.role}
          </p>
          <img
            src="/img/logout.png"
            className="w-6 h-6 ms-[20px] cursor-pointer"
            alt="botão de logout"
            onClick={handleLogout}
          />
        </div>

      </div>

      <figure className='bg-white rounded-full w-[4.4rem] h-[4.4rem] cursor-pointer' onClick={navigateUserProfile}>
        {user.user_img && (
          <img
            src={`http://localhost:3001${user.user_img}`}
            className="w-full h-full rounded-full"
            alt="imagem do usuário"
          />
        )}
      </figure>
    </div>
  );
}

export default UserProfileIcon;