import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import MainPage from '../MainPage/MainPage';

import LocalModal from '../../components/SectorModal/LocalModal';
import SectorModal from '../../components/SectorModal/SectorModal';
import EditSectorModal from '../../components/SectorModal/EditSectorModal';
import EditLocalModal from '../../components/SectorModal/EditLocalModal';

import Loading from '../../components/Loading/Loading';
import FlashMessage from '../../components/FlashMessage/FlashMessage';
import ShortModal from '../../components/ShortModal/ShortModal';
import LocalModal from '../../components/SectorModal/LocalModal';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import SearchBar from '../../components/SearchBar/SearchBar';

function Sector() {
  const [loading, setLoading] = useState(true);
  const [locals, setLocals] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [showLocalModal, setShowLocalModal] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [isEditingSector, setIsEditingSector] = useState(false);
  const [currentLocalId, setCurrentLocalId] = useState(null);
  const [currentSector, setCurrentSector] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const localsPerPage = 15;
  const [lastAddedId, setLastAddedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


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

  const deleteSector = async (sectorId) => {
    try {
      await api.delete(`/sector/${sectorId}`);
      setSectors((prevSectors) => prevSectors.filter((sector) => sector.sector_id !== sectorId));
    } catch (err) {
      console.error(err);
    }
  };

  const openSectorModal = (localId) => {
    setCurrentLocalId(localId);
    setSectorName('');
    setIsEditingSector(false);
    setNameError(null);
    setShowSectorModal(true);
  };

  const openEditSectorModal = (sector) => {
    setCurrentSector(sector);
    setSectorName(sector.sector_name);
    setIsEditingSector(true);
    setNameError(null);
    setShowSectorModal(true);
  };

  const showFlashMessage = (message, type) => {
    setFlash({ message, type });
    setTimeout(() => setFlash(null), 3000);
  };

  const validateSectorName = (sectorName) => {
    return sectors.some((sector) => sector.sector_name.toLowerCase() === sectorName.toLowerCase());
  };

  const handleSectorSubmit = async (e) => {
    e.preventDefault();
    if (validateSectorName(sectorName)) {
      setNameError('Este setor já existe');
      return;
    }

    try {
      if (isEditingSector) {
        const response = await api.put(`/sector/${currentSector.sector_id}`, { sector_name: sectorName });
        updateSector(response.data);
        showFlashMessage('Setor atualizado com sucesso!', 'success');
      } else {
        const response = await api.post('/sector', { sector_name: sectorName, local_id: currentLocalId });
        addSector(response.data);
        showFlashMessage('Setor adicionado com sucesso!', 'success');
      }
      setShowSectorModal(false);
    } catch (err) {
      console.error(err);
      showFlashMessage('Erro ao salvar o setor', 'error');
    }
  };

  const handleLocalAdded = (newLocal) => {
    setLocals((prevLocals) => [...prevLocals, newLocal]);
  };

  const handleLocalDelete = async (e) => {
    e.preventDefault();
    try {
      await api.delete(`/local/${currentLocalId}`);
      deleteLocal(currentLocalId);
      setOpenDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openDeleteModalLocal = (local) => {
    setCurrentLocalId(local.local_id);
    setOpenDeleteModal(true);
  };


  const deleteLocal = (localId) => {
    setLocals((prevLocals) => prevLocals.filter(local => local.local_id !== localId));
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
                  <p className="font-pixel text-2xl cursor-pointer" onClick={() => setShowLocalModal(true)}>
                    Adicionar novo local
                  </p>
                  <i className="fa-solid fa-plus ml-2 text-lg text-bold text-green-500"></i>
                </div>
                <SearchBar onSearch={handleSearch} />
              </div>

              <div className='overflow-x-auto w-full'>
                <table className='min-w-[600px] w-full border-collapse main-table'>
                  <thead>
                    <tr>
                      <th className="text-2xl font-pixel py-2 w-1/2 text-left">Local</th>
                      <th className="text-2xl font-pixel py-2 w-1/6 text-left">Endereço</th>
                      <th className="text-2xl font-pixel py-2 w-1/4 text-left">Setor</th>
                      <th className="text-2xl font-pixel py-2 w-[10%]"></th>
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
                                      className="font-pixel p-1 btn-3d text-[#F4BD76] ml-2"
                                      style={{
                                        backgroundColor: buttonBgColor,
                                      }}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => deleteSector(sector.sector_id)}
                                      className="font-pixel p-1 btn-3d text-[#F4BD76] ml-2"
                                      style={{
                                        backgroundColor: buttonBgColor,
                                      }}
                                    >
                                      Excluir
                                    </button>
                                  </li>
                                ))}
                            </ul>
                          </td>
                          <td className="flex items-center justify-center space-x-4 w-full">
                            <div className="w-full flex justify-evenly items-center my-2">
                              <button
                                onClick={() => openEditLocalModal(local)}
                                className="font-pixel p-2 justify-center items-center btn-3d"
                                style={{ backgroundColor: buttonBgColor }}
                              >
                                <i className="fa-solid fa-pencil"></i>
                              </button>
                              <button
                                onClick={() => openDeleteModalLocal(local)}
                                className="font-pixel p-2 justify-center items-center btn-3d"
                                style={{ backgroundColor: buttonBgColor }}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                              <button
                                onClick={() => openSectorModal(local.local_id)}
                                className="font-pixel p-2 justify-center items-center btn-3d"
                                style={{ backgroundColor: buttonBgColor }}
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


      {showLocalModal && <LocalModal onLocalAdded={addLocal} onClose={() => setShowLocalModal(false)} />}
      {showSectorModal && <SectorModal localId={currentLocalId} onSectorAdded={addSector} onClose={() => setShowSectorModal(false)} />}
      {showEditSectorModal && <EditSectorModal sector={currentSector} onSectorUpdated={updateSector} onClose={() => setShowEditSectorModal(false)} />}
      {showEditLocalModal && <EditLocalModal localId={currentLocalId} onLocalUpdated={updateLocal} onClose={() => setShowEditLocalModal(false)} />}

      {openDeleteModal && <ModalDelete title="Deseja excluir o local?" handleSubmit={handleLocalDelete} closeModal={() => setOpenDeleteModal(false)} />}
    </MainPage>
  );
}

export default Sector;