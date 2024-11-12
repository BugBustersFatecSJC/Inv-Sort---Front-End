import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import SearchBarMove from '../SearchBar/SearchBarMove';
import Loading from '../Loading/Loading';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid'; // Importando os ícones

function ProductTableMvSt() {
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [order, setOrder] = useState('desc'); // Estado para ordem de filtragem

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  const fetchStockMovements = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/movementpage');
      setStockMovements(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao buscar movimentações de estoque');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockMovements();
  }, []);


  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const filteredMovements = stockMovements
    .filter((movement) => {
      const filterKeys = Object.keys(filters);
      return filterKeys.every((key) => {
        if (filters[key]) {
          if (key === 'productName') {
            return movement.product?.product_name?.toLowerCase().includes(filters.productName.toLowerCase());
          }
          if (key === 'username') {
            return movement.user?.username?.toLowerCase().includes(filters.username.toLowerCase());
          }
          if (key === 'batchId') {
            return movement.batch?.batch_id?.toString().includes(filters.batchId);
          }
          if (key === 'categoryName') {
            return movement.category?.category_name?.toLowerCase().includes(filters.categoryName.toLowerCase());
          }
          if (key === 'movementType') {
            return movement.movement_type === filters.movementType;
          }
          if (key === 'movementDate') {
            return new Date(movement.movement_date).toISOString().split('T')[0] === filters.movementDate;
          }
        }
        return true;
      });
    })
    .sort((a, b) => {
      const dateA = new Date(a.movement_date);
      const dateB = new Date(b.movement_date);
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const currentMovements = filteredMovements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const openModal = (movement) => {
    setSelectedMovement(movement);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovement(null);
  };


  const goToNextPage = () => {
    if (currentPage * itemsPerPage < filteredMovements.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const toggleOrder = () => {
    setOrder(prevOrder => prevOrder === 'desc' ? 'asc' : 'desc');
  };

  if (loading) {
    return <Loading />;

  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="overflow-x-auto px-4 sm:px-6 lg:px-8">
      <SearchBarMove onApplyFilters={applyFilters} />

      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <span className="text-[#6B3710] text-sm sm:text-base">Ordenar por:</span>
        <button
          onClick={toggleOrder}
          className="bg-[#6B3710] text-[#FFC376] px-4 py-2 rounded-lg hover:bg-[#C17B46] flex items-center gap-2"
        >
          {order === 'desc' ? (
            <>
              <ChevronUpIcon className="h-5 w-5 text-[#FFC376]" />
              <span className="text-sm sm:text-base">Mais recentes</span>
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-5 w-5 text-[#FFC376]" />
              <span className="text-sm sm:text-base">Mais antigos</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto max-h-[450px] sm:max-h-[500px]">
        <table className="w-full mx-auto mt-4 b-4 table-auto border-collapse bg-[#6B3710] text-[#6B3710]">
          <thead>
            <tr className="bg-[#6B3710] text-white">
              <th className="px-4 py-2 border text-xs sm:text-sm">Produto</th>
              <th className="px-4 py-2 border text-xs sm:text-sm">Quantidade</th>
              <th className="px-4 py-2 border text-xs sm:text-sm">Lote</th>
              <th className="px-4 py-2 border text-xs sm:text-sm">Tipo de Movimentação</th>
              <th className="px-4 py-2 border text-xs sm:text-sm">Usuário</th>
              <th className="px-4 py-2 border text-xs sm:text-sm">Data da Movimentação</th>
              <th className="px-4 py-2 border text-xs sm:text-sm">Categoria</th>

            </tr>
          </thead>
          <tbody>
            {currentMovements.map((movement, index) => (
              <tr
                key={movement.movement_id}
                className={index % 2 === 0 ? "bg-[#F5A66D]" : "bg-[#EA9457]"}
                onClick={() => openModal(movement)}
              >

                <td className="text-xs sm:text-sm">{movement.product ? movement.product.product_name : "N/A"}</td>
                <td className="text-xs sm:text-sm">{movement.quantity}</td>
                <td className="text-xs sm:text-sm">{movement.batch ? movement.batch.batch_id : "N/A"}</td>
                <td className="text-xs sm:text-sm">{movement.movement_type}</td>
                <td className="text-xs sm:text-sm">{movement.user ? movement.user.username : "N/A"}</td>
                <td className="text-xs sm:text-sm">{new Date(movement.movement_date).toLocaleString()}</td>
                <td className="text-xs sm:text-sm">{movement.category ? movement.category.category_name : "N/A"}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="flex justify-center mt-8">
        <button
          onClick={goToPreviousPage}
          className="bg-[#6B3710] text-[#FFC376] font-medium px-4 py-2 rounded-lg mr-2 
          hover:bg-[#4e2d19] disabled:bg-[#4c2a17] disabled:text-[#ccc] 
          disabled:cursor-not-allowed"

          disabled={currentPage === 1}
        >
          Anterior
        </button>

        <span className="text-[#6B3710] content-center poppins-medium align-middle mx-4 text-sm sm:text-base">
          Página {currentPage} de {Math.ceil(filteredMovements.length / itemsPerPage)}
        </span>
        <button
          onClick={goToNextPage}
          className="bg-[#6B3710] text-[#FFC376] font-medium px-4 py-2 rounded-lg mr-2 
          hover:bg-[#4e2d19] disabled:bg-[#4c2a17] disabled:text-[#ccc] 
          disabled:cursor-not-allowed"

          disabled={currentPage * itemsPerPage >= filteredMovements.length}
        >
          Próxima
        </button>
 {isModalOpen && selectedMovement && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-[#6B3710] p-6 rounded-lg max-w-4xl w-full">
            <h2 className="text-xl font-bold mb-4 text-white">Detalhes da Movimentação</h2>
            <div className="grid grid-cols-2 gap-4 text-white text-xs sm:text-sm">
              <div><strong>Produto:</strong> {selectedMovement.product ? selectedMovement.product.product_name : 'N/A'}</div>
              <div><strong>Quantidade:</strong> {selectedMovement.quantity}</div>
              <div><strong>Lote:</strong> {selectedMovement.batch ? selectedMovement.batch.batch_id : 'N/A'}</div>
              <div><strong>Tipo de Movimentação:</strong> {selectedMovement.movement_type}</div>
              <div><strong>Usuário:</strong> {selectedMovement.user ? selectedMovement.user.username : 'N/A'}</div>
              <div><strong>Categoria:</strong> {selectedMovement.category ? selectedMovement.category.category_name : 'N/A'}</div>
              <div><strong>Valor do Produto:</strong> {selectedMovement.product?.prod_cost_value ?? 'N/A'}</div>
              <div><strong>Valor Total:</strong> {selectedMovement.batch?.batch_value_total ?? 'N/A'}</div>
              <div><strong>Estoque Atual:</strong> {selectedMovement.product_stock ?? 'N/A'}</div>
              <div><strong>Estoque Mínimo:</strong> {selectedMovement.product_stock_min ?? 'N/A'}</div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-[#C17B46]">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default ProductTableMvSt;
