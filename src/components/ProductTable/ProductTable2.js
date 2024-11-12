
import { useState, useEffect } from 'react';
import ProductRow from '../../components/ProductRow/ProductRow2';
import api from '../../services/api';
import SearchBar from '../SearchBar/SearchBar';
import { useParams } from 'react-router-dom';
import ProductCell from '../ProductCell/ProductCell';
import Modal from '../Modal/Modal'


const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtrado, setFiltrado] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default to 20 for desktop

  const id = useParams().id;
  console.log(id);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/category/' + id);
      setProducts(Array.isArray(response.data) ? response.data : []);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Filter products based on search term
  const filtrarProducts = (products) => {
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
    setFiltrado(filtrarProducts(products));
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

  // Paginate the products array
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtrado.slice(indexOfFirstItem, indexOfLastItem);
  
  class Compra{
    constructor(id,buyorsell,quantity,validade,maximo){
      this.id=id
      this.buyorsell=buyorsell
      this.quantity=quantity
      this.validade=validade
      this.maximo=maximo
  }}

  const handleProductClick = (product) => {
    let novaCompra = new Compra (product.product_id,
      prompt("Digite buy-Para Comprar/sell-Para Vender"),
      parseInt(prompt("Quantidade a ser modificada:")),
      prompt("Insira a data de Validade YYYY/MM/DD"),
      parseInt(prompt("Quantidade Maxima:")))

    console.log("Produto clicado:", novaCompra);

    let url =`http://localhost:3001/buyandsell/${novaCompra.buyorsell}/${novaCompra.id}`
    api.post(url,novaCompra)

    alert('LIBERDADE!!!!!')
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

  return (
    <div className="product-table max-h-[70%]">
      <SearchBar handlesSearch={handleSearch} />
      <div className="flex grid mt-4 overflow-y-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 text-center justify-center flex-wrap gap-2 p-1">
        {currentItems.map((product, index) => (
          <ProductCell product={product} key={index} onClick={handleProductClick} />
        ))}
      </div>

      <div className="pagination flex justify-center mt-4">
      <button
        className="bg-[#6B3710] text-[#FFC376] font-medium px-4 py-2 rounded-lg mr-2 
                  hover:bg-[#4e2d19] disabled:bg-[#4c2a17] disabled:text-[#ccc] 
                  disabled:cursor-not-allowed"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      <span className="text-[#6B3710] font-medium">Página {currentPage}</span>

      <button
        className="bg-[#6B3710] text-[#FFC376] font-medium px-4 py-2 rounded-lg ml-2 
                  hover:bg-[#4e2d19] disabled:bg-[#4c2a17] disabled:text-[#ccc] 
                  disabled:cursor-not-allowed"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage * itemsPerPage >= filtrado.length}
      >
        Próxima
      </button>
      </div>
    </div>
  );
};

export default ProductTable;
