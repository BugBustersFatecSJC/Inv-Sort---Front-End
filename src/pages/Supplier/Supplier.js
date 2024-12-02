import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import MainPage from '../MainPage/MainPage';
import Loading from '../../components/Loading/Loading';
import SearchBarAlt from '../../components/SearchBarAlt/SearchBarAlt';
import './Supplier.css';
import FlashMessage from '../../components/FlashMessage/FlashMessage';
import ShortModal from '../../components/ShortModal/ShortModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'; 

function SupplierPage() {
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [flash, setFlash] = useState(null);
  const [supplierName, setSupplierName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [address, setAddress] = useState('');
  const [nameError, setNameError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número de fornecedores por página

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/supplier');
      setSuppliers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSuppliers();
  }, []);

  const addSupplier = (newSupplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
    setLastAddedId(newSupplier.supplier_id);
  };

  const updateSupplier = (supplierId, updatedSupplier) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier.supplier_id === supplierId ? { ...supplier, ...updatedSupplier } : supplier
      )
    );
  };



  const toggleModal = (supplier = null) => {
    setSelectedSupplier(supplier);
    setShowModal(!showModal);
    if (supplier) {
      setSupplierName(supplier.supplier_name);
      setContactInfo(supplier.contact_info || '');
      setAddress(supplier.address || '');
    } else {
      setSupplierName('');
      setContactInfo('');
      setAddress('');
      setNameError(null);
    }
  };

  const showFlashMessage = (message, type) => {
    setFlash({ message, type });
    setTimeout(() => setFlash(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const supplierData = {
      supplier_name: supplierName,
      contact_info: contactInfo,
      address: address,
    };

    try {
      if (selectedSupplier) {
        await api.put(`/supplier/${selectedSupplier.supplier_id}`, supplierData);
        updateSupplier(selectedSupplier.supplier_id, supplierData);
      } else {
        const response = await api.post('/supplier', supplierData);
        addSupplier(response.data);
      }
      showFlashMessage('Fornecedor salvo com sucesso!', 'success');
      toggleModal();
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 400 && err.response.data.error.code === 'P2002') {
        setNameError("Já existe um fornecedor com o mesmo nome");
      }
      showFlashMessage('Um erro aconteceu', 'error');
    }
  };

  /**
   * Barra de pesquisa
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const paginationRange = () => {
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

  const currentSuppliers = filteredSuppliers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  
  /**
   * Deletar fornecedor
   */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const confirmDeleteSupplier = (supplierId) => {
    setSupplierToDelete(supplierId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!supplierToDelete) return;

    try {
      await api.delete(`/supplier/${supplierToDelete}`);
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.supplier_id !== supplierToDelete)
      );
      showFlashMessage('Fornecedor excluído com sucesso!', 'success');
    } catch (err) {
      console.error(err);
      showFlashMessage('Erro ao excluir fornecedor.', 'error');
    } finally {
      setShowDeleteModal(false);
      setSupplierToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSupplierToDelete(null);
  };

  return (
    <MainPage title="Gestão de Fornecedores">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="product-table w-full bg-[#FFC376]">
            <div>
              <div className='flex justify-between w-full items-end mb-6 table-header-container'>
                <div className='flex items-end'>
                  <p className="poppins-medium  cursor-pointer p-2 bg-[#008148] rounded text-white" onClick={() => toggleModal()}>
                    Adicionar fornecedor
                  </p>
                </div>
                <SearchBarAlt onSearch={handleSearch} />
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full mx-auto mt-4 b-4 table-auto border-collapse bg-[#6B3710] text-[#6B3710]">
                  <thead>
                    <tr className="bg-[#6B3710] text-white">
                      <th className="px-4 py-2 border-b border-r border-[#FFCB8F] text-xs sm:text-sm text-left">Nome</th>
                      <th className="px-4 py-2 border-b border-r border-[#FFCB8F] text-xs sm:text-sm text-left">Contato</th>
                      <th className="px-4 py-2 border-b border-r border-[#FFCB8F] text-xs sm:text-sm text-left">Endereço</th>
                      <th className="px-4 py-2 border-b border-[#FFCB8F] text-xs sm:text-sm w-[10%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSuppliers.map((supplier, index) => {
                      const rowBgColor = index % 2 === 0 ? '#EA9457' : '#F5A66D';

                      return (
                        <motion.tr
                          key={supplier.supplier_id}
                          initial={lastAddedId === supplier.supplier_id ? { scale: 0.8, opacity: 0 } : {}}
                          animate={lastAddedId === supplier.supplier_id ? { scale: 1, opacity: 1 } : {}}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            duration: 0.3
                          }}
                          className={`${rowBgColor} border-b border-[#FFCB8F] hover:bg-orange-100`}
                          style={{ backgroundColor: rowBgColor }}
                        >
                          <td className="text-xs sm:text-sm">
                            {supplier.supplier_name}
                          </td>
                          <td className="text-xs sm:text-sm">
                            {supplier.contact_info}
                          </td>
                          <td className="text-xs sm:text-sm">
                            {supplier.address}
                          </td>
                          <td className="flex items-center justify-center space-x-4 p-o w-full">
                            <div className='w-full flex justify-evenly p-0'>
                              <button 
                                onClick={() => toggleModal(supplier)} 
                                className="flex  font-pixel border-0 p-3 justify-center items-center btn-3d alt-color-bg"	 color='#6b3710'
                              >
                                <i className="fa-solid fa-pencil"></i>
                              </button> 

                              <button
                                onClick={() => confirmDeleteSupplier(supplier.supplier_id)}
                                className="flex border-0  font-pixel p-3 justify-center items-center btn-3d bg-[#FF1B1C]"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Paginação */}
              
              <div className="flex justify-center mt-8">
                <button
                  onClick={goToPreviousPage}
                  className="bg-[#6B3710] text-[#FFC376] font-medium px-4 py-2 rounded-lg mr-2 hover:bg-[#4e2d19] disabled:bg-[#4c2a17] disabled:text-[#ccc] disabled:cursor-not-allowed"
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
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-[#4e2d19] text-[#FFC376]' : 'text-[#6B3710] hover:bg-[#C17B46]'}`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={goToNextPage}
                  className="bg-[#6B3710] text-[#FFC376] font-medium px-4 py-2 rounded-lg ml-2 hover:bg-[#4e2d19] disabled:bg-[#4c2a17] disabled:text-[#ccc] disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon className="h-5 w-5 text-[#FFC376]" />
                </button>
              </div>
            </div>
          </div>

          {/* Modal de Adicionar/Editar Fornecedor */}
          {showModal && (
            <ShortModal
              show={showModal}
              onClose={toggleModal}
              onSubmit={handleSubmit}
              nameError={nameError}
              supplierName={supplierName}
              setSupplierName={setSupplierName}
              contactInfo={contactInfo}
              setContactInfo={setContactInfo}
              address={address}
              setAddress={setAddress}
            />
          )}
        </>
      )}
      {showModal && (
        <ShortModal title={selectedSupplier ? 'Editar Fornecedor' : 'Adicionar Fornecedor'} handleSubmit={handleSubmit} modalName="fornecedor-modal" closeModal={() => toggleModal()}>
          <div className="form-control mb-4">
            <label className="label">Nome do Fornecedor</label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
              required
            />
            {nameError && (
              <p className="text-red-500 mt-1 text-xl font-pixel">{nameError}</p>
            )}
          </div>

          <div className="form-control mb-4">
            <label className="label">Informações de Contato</label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">Endereço</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
            />
          </div>
        </ShortModal>
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          title="Confirmar Exclusão"
          message="Você tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {flash && <FlashMessage  message={flash.message} type={flash.type} duration={3000} onClose={() => setFlash(null)}  />}
    </MainPage>
  );
}

export default SupplierPage;
