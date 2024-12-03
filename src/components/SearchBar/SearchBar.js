import React, { useState } from 'react';
import './SearchBar.css'
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="flex rounded-lg w-56  bg-[#6B3710] p-2 items-center">
      <input
        className="h-6 w-full bg-[#6B3710] text-[#ffc376] poppins-semibold outline-none px-2 shadow-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Procure aqui..."
      />
      <button
        onClick={query ? clearSearch : handleSearch}
        className="ml-2 shadow-none"
      >
        {query ? (
          <i  className="fa-solid fa-times" style={{ fontSize: '20px',color:'#FFC376' }}></i> 
        ) : (
           <img className='w-8 p-1' src='/images/magnifier.png'/>
        )}
      </button>
    </div>
  );
};

export default SearchBar;
