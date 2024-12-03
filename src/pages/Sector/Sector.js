import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import MainPage from '../MainPage/MainPage';
import LocalModal from '../../components/SectorModal/LocalModal';
import EditSectorModal from '../../components/SectorModal/EditSectorModal';
import EditLocalModal from '../../components/SectorModal/EditLocalModal';
import Loading from '../../components/Loading/Loading';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import SearchBarAlt from '../../components/SearchBarAlt/SearchBarAlt';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'; // Ícones para navegação
import SectorModal from '../../components/SectorModal/SectorModal';

function LocalPage() {
  const [loading, setLoading] = useState(true);
  const [locals, setLocals] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [showLocalModal, setShowLocalModal] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showEditSectorModal, setShowEditSectorModal] = useState(false);
  const [showEditLocalModal, setShowEditLocalModal] = useState(false);
  const [currentLocal, setCurrentLocal] = useState(null);
  const [currentSector, setCurrentSector] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const localsPerPage = 10;
  const [lastAddedId, setLastAddedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteModalSector, setOpenDeleteModalSector] = useState(false);
  const [currentSectorForDelete, setCurrentSectorForDelete] = useState(null);


  const fetchLocals = async () => {
    try {
      const response = await api.get('/local');
      setLocals(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectors = async () => {
    try {
      const response = await api.get('/sector');
      setSectors(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLocals();
    fetchSectors();
  }, []);

  const addLocal = (newLocal) => {
    setLocals((prevLocals) => [...prevLocals, newLocal]);
    setLastAddedId(newLocal.local_id);
  };

  const updateLocal = (updatedLocal) => {
    setLocals((prevLocals) =>
      prevLocals.map((local) =>
        local.local_id === updatedLocal.local_id ? updatedLocal : local
      )
    );
  };

  const addSector = (newSector) => {
    setSectors((prevSectors) => [...prevSectors, newSector]);
  };

  const updateSector = (updatedSector) => {
    setSectors((prevSectors) =>
      prevSectors.map((sector) =>
        sector.sector_id === updatedSector.sector_id ? updatedSector : sector
      )
    );
  };

  const openModalDeleteSector = (sector) => {
    setCurrentSectorForDelete(sector);
    setOpenDeleteModalSector(true);
  };  

  const handleDeleteSector = async (e) => {
    e.preventDefault();
    try {
      await api.delete(`/sector/${currentSectorForDelete.sector_id}`);
      setSectors((prevSectors) => prevSectors.filter((sector) => sector.sector_id !== currentSectorForDelete.sector_id));
      setOpenDeleteModalSector(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openSectorModal = (localId) => {
    setCurrentLocal(localId);
    setShowSectorModal(true);
  };

  const openEditSectorModal = (sector) => {
    setCurrentSector(sector);
    setShowEditSectorModal(true);
  };

  const openEditLocalModal = (local) => {
    setCurrentLocal(local);
    setShowEditLocalModal(true);
  };

  const handleLocalDelete = async (e) => {
    e.preventDefault();
    try {
      await api.delete(`/local/${currentLocal.local_id}`);
      deleteLocal(currentLocal.local_id);
      setOpenDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openDeleteModalLocal = (local) => {
    setCurrentLocal(local);
    setOpenDeleteModal(true);
  };

  const deleteLocal = (localId) => {
    setLocals((prevLocals) => prevLocals.filter((local) => local.local_id !== localId));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredLocals = locals.filter((local) =>
    local.local_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastLocal = currentPage * localsPerPage;
  const indexOfFirstLocal = indexOfLastLocal - localsPerPage;
  const currentLocals = filteredLocals.slice(indexOfFirstLocal, indexOfLastLocal);

  const totalPages = Math.ceil(filteredLocals.length / localsPerPage);

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
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <MainPage title="Gestão de Locais e Setores">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="product-table w-full bg-[#FFC376]">
            <div className=''>
              <div className='flex justify-between w-full items-end mb-6 table-header-container'>
                <div className='flex items-end'>
                  <p className="poppins-medium  cursor-pointer p-2 bg-[#008148] rounded text-white" onClick={() => setShowLocalModal(true)}>
                    Adicionar local
                  </p>
                </div>
                <SearchBarAlt onSearch={handleSearch} />
              </div>

              <div className='overflow-x-auto w-full'>
                <table className='w-full mx-auto mt-4 b-4 table-auto border-collapse bg-[#6B3710] text-[#6B3710] md:whitespace-normal whitespace-nowrap'>
                  <thead>
                    <tr className="bg-[#6B3710] text-white">
                      <th className="px-4 py-2 border-b border-r border-[#FFCB8F] text-xs sm:text-sm text-left">Local</th>
                      <th className="px-4 py-2 border-b border-r border-[#FFCB8F] text-xs sm:text-sm text-left">Endereço</th>
                      <th className="px-4 py-2 border-b border-r border-[#FFCB8F] text-xs sm:text-sm text-left">Setor</th>
                      <th className="px-4 py-2 border-b border-[#FFCB8F] text-xs sm:text-sm w-[10%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLocals.map((local, index) => {
                      const rowBgColor = index % 2 === 0 ? '#EA9457' : '#F5A66D';
                      const buttonBgColor = index % 2 === 0 ? '#F2B080' : '#F7B687';

                      return (
                        <motion.tr
                          key={local.local_id}
                          initial={lastAddedId === local.local_id ? { scale: 0.8, opacity: 0 } : {}}
                          animate={lastAddedId === local.local_id ? { scale: 1, opacity: 1 } : {}}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            duration: 0.3
                          }}
                          className={`${rowBgColor} border-b border-[#FFCB8F] hover:bg-orange-100`}
                          style={{ backgroundColor: rowBgColor }}
                        >
                          <td className="border border-[#FFCB8F] p-2">{local.local_name}</td>
                          <td className="border border-[#FFCB8F] p-2">{local.local_address}</td>
                          <td className="border border-[#FFCB8F] p-2">
                            <ul>
                              {sectors
                                .filter((sector) => sector.local_id === local.local_id)
                                .map((sector) => (
                                  <li key={sector.sector_id} className='my-2'>
                                    {sector.sector_name}
                                    <button
                                      onClick={() => openEditSectorModal(sector)}
                                      className="ml-2 poppins  justify-center items-center btn-2d"
                                    >
                                      <i className="fa-solid fa-pencil"></i>
                                    </button>
                                    <button
                                      onClick={() => openModalDeleteSector(sector)}
                                      className="ml-2 poppins p-2 justify-center items-center  btn-2d" 
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </button>
                                  </li>
                                ))}
                            </ul>
                          </td>
                          <td className="text-xs sm:text-sm">
                              <div className='flex'>
                              <button
                                onClick={() => openEditLocalModal(local)}

                                className="poppins p-2 justify-center items-center btn-3d bg-[#6B3710]"
                              >
                                <i className="fa-solid fa-pencil"></i>
                              </button>
                              <button
                                onClick={() => openDeleteModalLocal(local)}

                                className="poppins p-2 justify-center items-center btn-3d bg-[#FF1B1C]"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                              <button
                                onClick={() => openSectorModal(local.local_id)}
                                className="poppins p-2 justify-center items-center btn-3d bg-[#008148]"
                              >
                                <i className="fa-solid fa-plus"></i>
                              </button>
                              </div>
                            
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

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
        </>
      )}

      {showLocalModal && <LocalModal onLocalAdded={addLocal} onClose={() => setShowLocalModal(false)} />}
      {showEditSectorModal && <EditSectorModal sector={currentSector} onSectorUpdated={updateSector} onClose={() => setShowEditSectorModal(false)} />}
      {showEditLocalModal && <EditLocalModal local={currentLocal} onLocalUpdated={updateLocal} onClose={() => setShowEditLocalModal(false)} />}
      {openDeleteModal && <ModalDelete title="Deseja excluir o local?" handleSubmit={handleLocalDelete} closeModal={() => setOpenDeleteModal(false)} />}
      {showSectorModal && <SectorModal localId={currentLocal} onSectorAdded={addSector} onClose={() => setShowSectorModal(false)} />}
      {openDeleteModalSector && (
        <ModalDelete
          title="Deseja excluir o setor?"
          handleSubmit={handleDeleteSector}
          closeModal={() => setOpenDeleteModalSector(false)}
        />
      )}
    </MainPage>
  );
}

export default LocalPage;
