import React, { useState } from 'react';
import styles from './ProductFilter.module.css';  // Use styles se for módulo

function ProductFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({ product_name: '', unit: '', unit_id: '', supplier_id: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);  // Passa os filtros atuais para o componente pai
  };

  return (
    <div className={styles.filterContainer}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
        <input
          type="text"
          placeholder="Nome do Produto"
          onChange={(e) => setFilters({ ...filters, product_name: e.target.value })}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Unidade (kg,lt,un)"
          onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
          className={styles.filterInput}
        />
        <input
          type="number"
          placeholder="ID da Unidade"
          onChange={(e) => setFilters({ ...filters, unit_id: e.target.value })}
          className={styles.filterInput}
        />
        <input
          type="number"
          placeholder="ID do Fornecedor"
          onChange={(e) => setFilters({ ...filters, supplier_id: e.target.value })}
          className={styles.filterInput}
        />
        <button type="submit" className={styles.submitButton}>
          Aplicar Filtro
        </button>
      </form>
    </div>
  );
}

export default ProductFilter;
