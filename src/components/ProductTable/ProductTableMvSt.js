import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import SearchBar from '../SearchBar/SearchBar';

function Modal({ isOpen, onClose, movement }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div className="bg-[#6B3710] p-6 rounded-lg max-w-4xl w-full">
        <h2 className="text-xl font-bold mb-4 text-white">Detalhes da Movimentação</h2>
        <div className="grid grid-cols-2 gap-4 text-white">
          <div><strong>Produto:</strong> {movement.product ? movement.product.product_name : 'N/A'}</div>
          <div><strong>Quantidade:</strong> {movement.quantity}</div>
          <div><strong>Lote:</strong> {movement.batch ? movement.batch.batch_id : 'N/A'}</div>
          <div><strong>Tipo de Movimentação:</strong> {movement.movement_type}</div>
          <div><strong>Usuário:</strong> {movement.user ? movement.user.username : 'N/A'}</div>
          <div><strong>Data da Movimentação:</strong> {new Date(movement.movement_date).toLocaleString()}</div>
          <div><strong>Valor do Produto:</strong> {movement.product?.prod_cost_value ?? 'N/A'}</div>
          <div><strong>Valor Total:</strong> {movement.batch?.batch_value_total ?? 'N/A'}</div>
          <div><strong>Estoque Atual:</strong> {movement.product_stock ?? 'N/A'}</div>
          <div><strong>Estoque Mínimo:</strong> {movement.product_stock_min ?? 'N/A'}</div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Fechar</button>
        </div>
      </div>
    </div>
  );
}

function ProductTableMvSt() {
  // Estados
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovement, setSelectedMovement] = useState(null); // Para o modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal
  const [searchTerm, setSearchTerm] = useState(''); // Estado para armazenar o termo de busca

  // Estados para a paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Função para buscar os dados de movimentação de estoque
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
  
  // Usar useEffect para buscar os dados quando o componente for montado
  useEffect(() => {
    fetchStockMovements();
  }, []);

  // Calcular os dados da página atual
  const indexOfLastMovement = currentPage * itemsPerPage;
  const indexOfFirstMovement = indexOfLastMovement - itemsPerPage;

  // Filtrando os dados com base no termo de busca
  const filteredMovements = stockMovements.filter((movement) => {
    const search = searchTerm.toLowerCase();
    return (
      movement.product?.product_name.toLowerCase().includes(search) ||
      movement.movement_type.toLowerCase().includes(search) ||
      (movement.batch?.batch_id && movement.batch.batch_id.toString().includes(search)) ||
      (movement.user?.username.toLowerCase().includes(search))
    );
  });

  const currentMovements = filteredMovements.slice(indexOfFirstMovement, indexOfLastMovement);

  // Função para abrir o modal
  const openModal = (movement) => {
    setSelectedMovement(movement);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovement(null);
  };

  // Funções de navegação de página
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

  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Verificando se os dados estão sendo carregados ou se ocorreu erro
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Função para atualizar o termo de busca
  const handleSearch = (query) => {
    setSearchTerm(query);
    setCurrentPage(1); // Reseta para a primeira página ao fazer uma nova pesquisa
  };

  // Renderizando a tabela
  return (
    <div className="overflow-x-auto ">
      {/* Barra de pesquisa */}
      <SearchBar handlesSearch={handleSearch} />

      
      <div className="max-h-[450px] overflow-y-auto overflow-x-scroll ">
        <table className="w-full mx-auto mt-4 b-4 table-auto border-collapse bg-[#6B3710] text-[#6B3710]">
          <thead>
            <tr className="bg-[#6B3710] text-white">
              <th className="px-4 py-2 border">Produto</th>
              <th className="px-4 py-2 border">Quantidade</th>
              <th className="px-4 py-2 border">Lote</th>
              <th className="px-4 py-2 border">Tipo de Movimentação</th>
              <th className="px-4 py-2 border">Usuário</th>
            </tr>
          </thead>
          <tbody>
            {currentMovements.map((movement, index) => (
              <tr
                key={movement.movement_id}
                className={index % 2 === 0 ? "bg-[#F5A66D]" : "bg-[#EA9457]"}
                onClick={() => openModal(movement)}
              >
                <td >{movement.product ? movement.product.product_name : "N/A"}</td>
                <td >{movement.quantity}</td>
                <td >{movement.batch ? movement.batch.batch_id : "N/A"}</td>
                <td >{movement.movement_type}</td>
                <td >{movement.user ? movement.user.username : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginação */}
      <div className="flex justify-center mt-8">
        <button
          onClick={goToPreviousPage}
          className="bg-[#6B3710] text-[#FFC376] poppins-medium px-4 py-2 rounded-lg mr-2"
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="text-[#6B3710] content-center poppins-medium  align-middle mx-4">{`Página ${currentPage} de ${Math.ceil(filteredMovements.length / itemsPerPage)}`}</span>
        <button
          onClick={goToNextPage}
          className="bg-[#6B3710] text-[#FFC376]  poppins-medium px-4 py-2 rounded-lg ml-2"
          disabled={currentPage * itemsPerPage >= filteredMovements.length}
        >
          Próxima
        </button>
      </div>

      {/* Exibe o modal se for necessário */}
      <Modal isOpen={isModalOpen} onClose={closeModal} movement={selectedMovement} />
    </div>  
  );
}

export default ProductTableMvSt;
