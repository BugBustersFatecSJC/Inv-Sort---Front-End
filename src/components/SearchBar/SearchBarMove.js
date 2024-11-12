import React, { useState } from 'react';

function SearchBarMove({ onApplyFilters, categories = [] }) {
  const [localFilters, setLocalFilters] = useState({
    searchField: 'product_name',  // Valor inicial para a pesquisa (produto por padrão)
    searchValue: '',
    movementType: '',
    movementDate: '',
  });

  // Atualiza o campo de pesquisa (product_name, username, etc.)
  const handleSearchFieldChange = (e) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      searchField: e.target.value,
      searchValue: '', // Resetando a pesquisa quando o campo de busca é alterado
    }));
  };

  // Atualiza o valor digitado na barra de pesquisa
  const handleSearchValueChange = (e) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      searchValue: e.target.value,
    }));
  };

  // Atualiza o tipo de movimentação (compra, venda)
  const handleMovementTypeChange = (e) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      movementType: e.target.value,
    }));
  };

  // Atualiza a data de movimentação
  const handleDateChange = (e) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      movementDate: e.target.value,
    }));
  };

  // Aplica os filtros quando o botão é clicado
  const handleApplyFilters = () => {
    const filters = { ...localFilters };

    if (filters.searchField === 'product_name' && filters.searchValue) {
      filters.productName = filters.searchValue;
    } else if (filters.searchField === 'username' && filters.searchValue) {
      filters.username = filters.searchValue;
    } else if (filters.searchField === 'batch_id' && filters.searchValue) {
      filters.batchId = filters.searchValue; // Use batchId para Lote
    } else if (filters.searchField === 'category_name' && filters.searchValue) {
      filters.categoryName = filters.searchValue; // Use categoryName para Categoria
    }

    onApplyFilters(filters); // Envia os filtros para a função onApplyFilters
  };

  return (
    <div className="bg-[#6B3710] p-4 rounded-lg mb-4" style={{ borderRadius: '8px' }}>
      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <select
            value={localFilters.searchField}
            onChange={handleSearchFieldChange}
            className="p-2 rounded-lg text-[#6B3710] bg-[#FFC376] w-full"
          >
            <option value="product_name">Produto</option>
            <option value="username">Usuário</option>
            <option value="quantity">Quantidade</option>
            <option value="batch_id">Lote</option>
            <option value="category_name">Categoria</option> {/* Adicionando categoria aqui */}
          </select>
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar"
            value={localFilters.searchValue}
            onChange={handleSearchValueChange}
            className="p-2 rounded-lg text-[#6B3710] bg-[#FFC376] w-full placeholder-[#6B3710]"
          />
        </div>

        <div className="flex-1">
          <select
            value={localFilters.movementType}
            onChange={handleMovementTypeChange}
            className="p-2 rounded-lg text-[#6B3710] bg-[#FFC376] w-full"
          >
            <option value="">Tipo de Movimentação</option>
            <option value="compra">Compra</option>
            <option value="venda">Venda</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-col">
          <label className="text-white">Data de Movimentação:</label>
          <input
            type="date"
            name="movementDate"
            value={localFilters.movementDate}
            onChange={handleDateChange}
            className="p-2 rounded-lg text-[#6B3710] bg-[#FFC376] w-full"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleApplyFilters}
          className="bg-[#FFC376] text-[#6B3710] font-bold py-2 px-4 rounded-lg"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

export default SearchBarMove;
