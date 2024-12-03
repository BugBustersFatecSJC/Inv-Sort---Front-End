import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import api from '../../services/api';

function UserProfileIcon() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringBatches, setExpiringBatches] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchLowStockProducts = async () => {
    try {
      const response = await api.get('/products/low-stock');
      setLowStockProducts(response.data.produtos || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExpiringBatches = async () => {
    try {
      const response = await api.get('/batch/close-expire');
      setExpiringBatches(response.data.lotes || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLowStockProducts();
      fetchExpiringBatches();
    }
  }, [user]);

  const navigateUserProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };
  

  if (!user) {
    return null;
  }

  const totalNotifications = lowStockProducts.length + expiringBatches.length;

  return (
    <div className="flex items-center w-full justify-between">
      <div className="flex">
        <div className="relative">
          <button
            className="poppins-regular text-sm mr-3 cursor-pointer md:hidden shadow-none tools-mobile-menu"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Opções <i className={`fa-solid fa-chevron-${showDropdown ? 'up' : 'down'}`}></i>
          </button>

          {showDropdown && (
            <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg w-[150px]">
              <p className="p-2 text-sm cursor-pointer" onClick={handleLogout}>
                Sair
              </p>
              <p className="p-2 text-sm cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
                Notificações
                {totalNotifications > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
                    {totalNotifications}
                  </span>
                )}
              </p>
              {/* <p className="p-2 text-sm cursor-pointer" onClick={navigateUserProfile}>Configurações</p> */}
            </div>
          )}
        </div>

        <div className="hidden md:flex">
          <p className="poppins-regular text-sm mr-3 cursor-pointer" onClick={handleLogout}>
            Sair
          </p>
          <div className="relative">
            <p
              className="poppins-regular text-sm mr-3 cursor-pointer relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              Notificações
              {totalNotifications > 0 && (
                <span className="absolute top-[-5px] right-[-10px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center blink">
                  {totalNotifications}
                </span>
              )}
            </p>

            {showNotifications && (
              <div className="absolute top-10 left-0 w-[300px] max-h-[300px] bg-white shadow-lg rounded-lg overflow-y-auto z-10">
                <h3 className="ml-2 mt-2 poppins-bold">Produtos com estoque baixo:</h3>
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map((product) => (
                    <div key={product.product_id} className="p-2 border-b border-gray-200 flex justify-between">
                      <p className="text-sm poppins-regular">{product.product_name}</p>
                      <p className="text-sm text-gray-500 poppins-regular">
                        Estoque: {product.product_stock}/{product.product_stock_min}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center p-2 text-gray-500">Nenhum produto com estoque baixo</p>
                )}

                <h3 className="ml-2 mt-4 poppins-bold">Lotes perto da validade:</h3>
                {expiringBatches.length > 0 ? (
                  expiringBatches.map((batch) => (
                    <div key={batch.batch_id} className="p-2 border-b border-gray-200 flex justify-between">
                      <p className="text-sm poppins-regular">Lote ID: {batch.batch_id}</p>
                      <p className="text-sm text-gray-500 poppins-regular">
                        Expira em: {new Date(batch.expiration_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center p-2 text-gray-500">Nenhum lote próximo da validade</p>
                )}
              </div>
            )}
          </div>
          {/* <p className="poppins-regular text-sm mr-3 cursor-pointer" onClick={navigateUserProfile}>Configurações</p> */}
        </div>
      </div>

      <div className="flex">
        <div className="me-3 flex flex-col justify-end text-end mr-4">
          <p className="poppins-medium text-[1rem] text-left">{user.username}</p>
          <div className="flex justify-between">
            <p className="font-pixel text-[1rem]">{user.role}</p>
          </div>
        </div>

        <figure
          className="bg-white rounded-full w-[3rem] h-[3rem] flex items-center justify-center cursor-pointer"
          onClick={navigateUserProfile}
        >
          {user.user_img ? (
            <img
              src={`http://localhost:3001${user.user_img}`}
              className="w-full h-full rounded-full"
              alt="imagem do usuário"
            />
          ) : (
            <i className="fa-solid fa-user-secret text-gray-400 text-3xl"></i>
          )}
        </figure>
      </div>
    </div>
  );
}

export default UserProfileIcon;
