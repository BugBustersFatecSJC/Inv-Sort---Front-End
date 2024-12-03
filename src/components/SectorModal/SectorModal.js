import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ShortModal from '../../components/ShortModal/ShortModal';

function SectorModal({ sectorId, onClose, onSectorAdded, isEditMode, localId }) {
  const [sectorName, setSectorName] = useState('');
  const [nameError, setNameError] = useState(null);

  useEffect(() => {
    if (isEditMode && sectorId) {
      const fetchSector = async () => {
        try {
          const response = await api.get(`/sector/${sectorId}`);
          setSectorName(response.data.sector_name);
        } catch (err) {
          console.error(err);
        }
      };
      fetchSector();
    }
  }, [isEditMode, sectorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditMode) {
        response = await api.put(`/sector/${sectorId}`, { sector_name: sectorName, local_id: localId });
      } else {
        response = await api.post('/sector', { sector_name: sectorName, local_id: localId });
        onSectorAdded(response.data);
      }

      setSectorName('');
      setNameError(null);
      onClose();
    } catch (err) {
      console.error(err);

      if (err.response && err.response.status === 400 && err.response.data.error === 'já existe um setor com este nome.') {
        setNameError('Já existe um setor com este nome.');
      }
    }
  };

  const modalTitle = isEditMode ? 'Editar Setor' : 'Adicionar Novo Setor';

  return (
    <ShortModal title={modalTitle} handleSubmit={handleSubmit} closeModal={onClose} modalName="sectorModal">
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
  );
}

export default SectorModal;
