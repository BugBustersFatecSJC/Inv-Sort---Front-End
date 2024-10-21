import React, { useState } from 'react';
import styles from './ProductFilter.module.css';  // Use styles se for módulo

function ProductFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({ product_id: '', supplier_id: '', is_perishable: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);  // Passa os filtros atuais para o componente pai
  };

  return (
    <div className={styles.filterContainer}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
        <input
          type="number"
          placeholder="ID do Produto"
          onChange={(e) => setFilters({ ...filters, product_id: e.target.value })}
          className={styles.filterInput}
        />
        <input
          type="number"
          placeholder="ID do Fornecedor"
          onChange={(e) => setFilters({ ...filters, supplier_id: e.target.value })}
          className={styles.filterInput}
        />
        <label className="flex items-center w-full">
          <input
            type="checkbox"
            checked={filters.is_perishable}
            onChange={(e) => setFilters({ ...filters, is_perishable: e.target.checked })}
            className="mr-2"
          />
          Perecível
        </label>
        <button type="submit" className={styles.submitButton}>
          Aplicar Filtro
        </button>
      </form>
    </div>
  );
}

export default ProductFilter;