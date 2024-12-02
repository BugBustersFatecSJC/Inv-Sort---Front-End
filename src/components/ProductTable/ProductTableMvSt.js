import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import SearchBarMove from '../SearchBar/SearchBarMove';
import Loading from '../Loading/Loading';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/solid'; // Icones da Filtragem

function ProductTableMvSt() {
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [order, setOrder] = useState('desc'); 

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

  const paginationRange = () => {
    const totalPageCount = totalPages;
    const currentPageNumber = currentPage;

    let pages = [];

    if (totalPageCount <= 5) {
      pages = Array.from({ length: totalPageCount }, (_, i) => i + 1);
    } else {
      if (currentPageNumber <= 3) {
        pages = [1, 2, 3, '...', totalPageCount];
      } else if (currentPageNumber >= totalPageCount - 2) {
        pages = [1, '...', totalPageCount - 2, totalPageCount - 1, totalPageCount];
      } else {
        pages = [
          1,
          '...',
          currentPageNumber - 1,
          currentPageNumber,
          currentPageNumber + 1,
          '...',
          totalPageCount,
        ];
      }
    }

    return pages;
  };

  const downloadPDF = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/stock-movements/pdf', {
        responseType: 'blob', // Necessário para lidar com arquivos binários
      });

      // Cria um link para o arquivo e realiza o download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'stock_movements.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao baixar o PDF:', error);
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

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleOrder = () => {
    setOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
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

        <button
          onClick={downloadPDF}
          className="bg-[#6B3710] text-[#FFC376] px-4 py-2 rounded-lg hover:bg-[#C17B46]"
        >
          Baixar PDF
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
                className={index % 2 === 0 ? 'bg-[#F5A66D]' : 'bg-[#EA9457]'}
                onClick={() => openModal(movement)}
              >
                <td className="text-xs sm:text-sm">{movement.product ? movement.product.product_name : 'N/A'}</td>
                <td className="text-xs sm:text-sm">{movement.quantity}</td>
                <td className="text-xs sm:text-sm">{movement.batch ? movement.batch.batch_id : 'N/A'}</td>
                <td className="text-xs sm:text-sm">{movement.movement_type}</td>
                <td className="text-xs sm:text-sm">{movement.user ? movement.user.username : 'N/A'}</td>
                <td className="text-xs sm:text-sm">{movement.movement_date}</td>
                <td className="text-xs sm:text-sm">{movement.category ? movement.category.category_name : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#6B3710] text-white rounded-md mr-2"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {paginationRange().map((page, index) => (
          <button
            key={index}
            onClick={() => goToPage(page)}
            className={`px-4 py-2 rounded-md ${
              page === currentPage ? 'bg-[#6B3710] text-white' : 'bg-[#F5A66D] text-[#6B3710]'
            }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#6B3710] text-white rounded-md ml-2"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {isModalOpen && selectedMovement && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-[#FFC376] p-6 rounded-lg max-w-4xl w-full border-4 border-[#D87B26]">
            <h2 className="text-xl font-bold mb-4 text-[#3E1A00]">Detalhes da Movimentação</h2>
            <div className="grid grid-cols-2 gap-4 text-[#3E1A00] text-xs sm:text-sm">
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
              <button onClick={closeModal} className="bg-[#3E1A00] text-[#FFC376] px-4 py-2 rounded-lg hover:bg-[#C17B46]">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductTableMvSt;