import React from 'react'

const FilterButton = ({ onFilterChange }) => {
  const handleFilterChange = (e) => {
    onFilterChange(e.target.value)
  }

  return (
    <div className="flex items-center space-x-2">
      <select
        id="filter"
        className="p-2 border rounded-md alt-color-3-bg text-[#3E1900] border-none shadow-sm"
        onChange={handleFilterChange}
      >
        <option value="alphabetical">Ordem Alfabética (A-Z)</option>
        <option value="reverse-alphabetical">Ordem Alfabética (Z-A)</option>
        <option value="newest">Mais Recentes</option>
        <option value="oldest">Mais Antigos</option>
      </select>
    </div>
  )
}

export default FilterButton
