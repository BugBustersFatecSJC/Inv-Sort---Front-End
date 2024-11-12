import React, { useState } from 'react';

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
    <div className="flex rounded-lg w-56 alt-color-3-bg p-2 items-center">
      <input
        className="h-6 w-full alt-color-3-bg text-[#3E1900] poppins-semibold outline-none px-2 shadow-none"
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
          <i className="fa-solid fa-times" style={{ fontSize: '20px' }}></i> 
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" width="20" height="20">
            <path d="M10 2a8 8 0 105.29 14.71l4.58 4.58 1.41-1.42-4.58-4.58A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
          </svg> 
        )}
      </button>
    </div>
  );
};

export default SearchBar;
