import React, { useState ,useEffect} from 'react';

const SearchBar = ({handlesSearch}) => {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = () => {
    handlesSearch(query);
  };
  useEffect(() => {
    
    handlesSearch(query);
    
  }, [query]);

  return (
    <div className="flex rounded-lg w-56 bg-[#6B3710] m-2 p-2 items-center">
      <input
        className="h-6 w-full bg-[#6B3710] text-[#FFC376] poppins-semibold outline-none px-2 shadow-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Procure aqui..."
      />
      <button   onClick={handleSearch} className="ml-2 shadow-none">
        <img src='/images/search.png' className='w-6 h-5'/>
      </button>
    </div>
  );
};

export default SearchBar;