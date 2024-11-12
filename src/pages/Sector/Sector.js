import { useState, useEffect } from 'react';
import api from '../../services/api';
import MainPage from '../MainPage/MainPage';
import Loading from '../../components/Loading/Loading';
import FlashMessage from '../../components/FlashMessage/FlashMessage';
import ShortModal from '../../components/ShortModal/ShortModal';
import LocalModal from '../../components/SectorModal/LocalModal';
import ModalDelete from '../../components/ModalDelete/ModalDelete';

function Sector() {
  const [loading, setLoading] = useState(true);
  const [locals, setLocals] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [showLocalModal, setShowLocalModal] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [isEditingSector, setIsEditingSector] = useState(false);
  const [currentLocalId, setCurrentLocalId] = useState(null);
  const [currentSector, setCurrentSector] = useState(null);
  const [flash, setFlash] = useState(null);
  const [sectorName, setSectorName] = useState('');
  const [nameError, setNameError] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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

  return (
    <MainPage title="Gestão de Locais e Setores">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="product-table w-full bg-[#FFC376] border-4 border-[#85450D]">
            <div className='border-4 border-[#B45105] p-3'>
              <h2 className="text-center font-pixel text-2x1 mb-4 px-4 py-2">
                <button onClick={() => setShowLocalModal(true)} className='font-pixel bg-[#362010] border-4 border-black text-[#F4BD76]'>Adicionar Novo Local</button>
              </h2>
              {locals.map((local) => (
                <div key={local.local_id} className="local-item">
                  <div className='font-pixel flex space-x-6 border-4 border-[#B45105] p-3'>
                    <h3>Local: {local.local_name}</h3>
                    <p>Endereço: {local.local_address}</p>
                    <button onClick={() => console.log(local)} className='font-pixel bg-[#362010] border-4 border-black text-[#F4BD76]'>Editar Local</button>
                    <button onClick={() => openDeleteModalLocal(local)} className='font-pixel bg-[#362010] border-4 border-black text-[#F4BD76]'>Excluir Local</button>
                    <h4>Setores:</h4>
                    <ul>
                      {sectors
                        .filter((sector) => sector.local_id === local.local_id)
                        .map((sector) => (
                          <li key={sector.sector_id}>
                            {sector.sector_name}
                            <button onClick={() => openEditSectorModal(sector)} className='font-pixel bg-[#362010] border-4 border-black text-[#F4BD76]'>Editar</button>
                            <button onClick={() => deleteSector(sector.sector_id)} className='font-pixel bg-[#362010] border-4 border-black text-[#F4BD76]'>Excluir</button>
                          </li>
                        ))}
                    </ul>
                    <button onClick={() => openSectorModal(local.local_id)} className='font-pixel bg-[#362010] border-4 border-black text-[#F4BD76]'>Adicionar Setor</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showLocalModal && (
        <LocalModal
          onLocalAdded={handleLocalAdded}
          onClose={() => setShowLocalModal(false)}
          isEditMode={false}
        />
      )}

      {showSectorModal && (
        <ShortModal
          title={isEditingSector ? 'Editar Setor' : 'Adicionar Novo Setor'}
          handleSubmit={handleSectorSubmit}
          closeModal={() => setShowSectorModal(false)}
        >
          <div className="form-control mb-4">
            <label className="label">Nome do Setor</label>
            <input
              type="text"
              className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
              required
            />
            {nameError && (
              <p className="text-red-500 mt-1 text-xl font-pixel">{nameError}</p>
            )}
          </div>
        </ShortModal>
      )}

      {flash && <FlashMessage message={flash.message} type={flash.type} duration={3000} onClose={() => setFlash(null)} />}
      {openDeleteModal && <ModalDelete title="Deseja excluir o local?" handleSubmit={handleLocalDelete} closeModal={() => setOpenDeleteModal(false)} />}
    </MainPage>
  );
}

export default Sector;