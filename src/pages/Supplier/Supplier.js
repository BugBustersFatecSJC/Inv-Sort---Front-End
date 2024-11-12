import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

import MainPage from '../MainPage/MainPage';
import SupplierModal from '../../components/SupplierModal/SupplierModal';
import Loading from '../../components/Loading/Loading';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Supplier.css'


function SupplierPage() {
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const suppliersPerPage = 15;
  const [lastAddedId, setLastAddedId] = useState(null);


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

  const removeSupplier = async (supplierId) => {
    const confirmDelete = window.confirm('Você tem certeza que deseja excluir este fornecedor?');

    if (!confirmDelete) {
      return;
    }


    try {
      await api.delete(`/supplier/${supplierId}`);
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.supplier_id !== supplierId)
      );
    } catch (err) {
      console.error(err);
    }
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
      setNameError(null)
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
      console.log(err)
      if (err.response && err.response.status === 400 && err.response.data.error.code === 'P2002') {
          setNameError("Já existe um fornecedor com o mesmo nome")
      }
      showFlashMessage('Um erro aconteceu', 'error');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastSupplier = currentPage * suppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);

  const totalPages = Math.ceil(filteredSuppliers.length / suppliersPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <MainPage title="Gestão de Fornecedores">
      {loading ? (
        <Loading />
      ) : (

        <>
          <div className="product-table w-full bg-[#FFC376]">
            <div className=''>
              <div className='flex justify-between w-full items-end mb-6 table-header-container'>
                <div className='flex items-end'>
                  <p className="font-pixel text-2xl cursor-pointer" onClick={() => toggleModal()}>
                    Adicionar novo fornecedor
                  </p>
                  <i className="fa-solid fa-plus ml-2 text-lg text-bold text-green-500"></i>
                </div>
                <SearchBar onSearch={handleSearch} />
              </div>

              <div className='overflow-x-auto w-full'>
                <table className="min-w-[600px] w-full border-collapse main-table">
                  <thead>
                    <tr>
                      <th className="text-2xl font-pixel py-2 w-1/2 text-left">Nome</th>
                      <th className="text-2xl font-pixel py-2 w-1/6 text-left">Contato</th>
                      <th className="text-2xl font-pixel py-2 w-1/4 text-left">Endereço</th>
                      <th className="text-2xl font-pixel py-2 w-[10%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSuppliers.map((supplier, index) => {
                      const rowBgColor = index % 2 === 0 ? '#EA9457' : '#F5A66D';
                      const buttonBgColor = index % 2 === 0 ? '#F2B080' : '#F7B687';

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
                          <td className="border border-[#FFCB8F] p-2 py-3 w-1/2">
                            {supplier.supplier_name}
                          </td>
                          <td className="border border-[#FFCB8F] p-2 w-1/6">
                            {supplier.contact_info}
                          </td>
                          <td className="border border-[#FFCB8F] p-2 w-1/4">
                            {supplier.address}
                          </td>
                          <td className="flex items-center justify-center space-x-4 w-full">
                            <div className='w-full flex justify-evenly my-2'>
                              <button 
                                onClick={() => toggleModal(supplier)} 
                                className="flex space-x-3 font-pixel p-2 justify-center items-center btn-3d" 
                                style={{ backgroundColor: buttonBgColor }}
                              >
                                <i className="fa-solid fa-pencil"></i>
                              </button> 

                              <button 
                                onClick={() => removeSupplier(supplier.supplier_id)} 
                                className="flex space-x-3 font-pixel p-2 justify-center items-center btn-3d" 
                                style={{ backgroundColor: buttonBgColor }}
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

              <div className="flex justify-center items-center space-x-4 mt-4">
                <button
                  onClick={goToPreviousPage}
                  className="shadow-none w-[2rem]"
                  disabled={currentPage === 1}
                >
                  <img src="/img/pointer-2.svg" alt="" />
                </button>
                <span className="font-pixel">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  className="shadow-none w-[2rem]"
                  disabled={currentPage === totalPages}
                >
                  <img src="/img/pointer-1.svg" alt="" />
                </button>
              </div>
            </div>
          </div>
        </>

      )}

      {flash && <FlashMessage  message={flash.message} type={flash.type} duration={3000} onClose={() => setFlash(null)}  />}
    </MainPage>
  );
}


export default SupplierPage;

