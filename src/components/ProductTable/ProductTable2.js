import { useState, useEffect } from 'react';
import ProductCell from '../ProductCell/ProductCell';
import SearchBar from '../SearchBar/SearchBar';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'; // Icones da Filtragem

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default to 20 for desktop

  const id = useParams().id;

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/category/' + id);
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  // Filter products based on search term
  const filterProducts = (products) => {
    return products.filter((product) => {
      if (searchTerm === '') return true;
      return product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // Handle search input change
  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  // Update filtered products when search term changes
  useEffect(() => {
    setFilteredProducts(filterProducts(products));
  }, [searchTerm, products]);

  // Determine items per page based on screen size (mobile vs desktop)
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(6); // Mobile (6 items per page)
      } else {
        setItemsPerPage(20); // Desktop (20 items per page)
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);

  // Paginate the filtered products array
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination range for quick navigation
  const paginationRange = () => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentPageNumber = currentPage;
    let pages = [];

    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPageNumber <= 3) {
        pages = [1, 2, 3, '...', totalPages];
      } else if (currentPageNumber >= totalPages - 2) {
        pages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [
          1,
          '...',
          currentPageNumber - 1,
          currentPageNumber,
          currentPageNumber + 1,
          '...',
          totalPages,
        ];
      }
    }

    return pages;
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

  return (
    <div className="product-table max-h-[70%]">
      <SearchBar handlesSearch={handleSearch} />

      <div className="flex grid mt-4 overflow-y-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 text-center justify-center flex-wrap gap-2 p-1">
        {currentItems.map((product, index) => (
          <ProductCell product={product} key={index} />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination flex justify-center mt-4">
        <button
          className="bg-[#6B3710] text-[#FFC376] font-medium px-4 py-2 rounded-lg mr-2 hover:bg-[#4e2d19] disabled:bg-[#4c2a17] disabled:text-[#ccc] disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-5 w-5 text-[#FFC376]" />

        </button>

        {paginationRange().map((page, index) =>
          page === '...' ? (
            <span key={index} className="px-4 py-2">...</span>
          ) : (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-[#4e2d19] text-[#FFC376]' : 'text-[#6B3710] hover:bg-[#C17B46]'}`}
            >
              {page}
            </button>
          )
        )}

        <button
          className="bg-[#6B3710] text-[#FFC376] font-medium px-4 py-2 rounded-lg ml-2 hover:bg-[#4e2d19] disabled:bg-[#4c2a17] disabled:text-[#ccc] disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= filteredProducts.length}
        >
          <ChevronRightIcon className="h-5 w-5 text-[#FFC376]" />

        </button>
      </div>
    </div>
  );
};

export default ProductTable;
