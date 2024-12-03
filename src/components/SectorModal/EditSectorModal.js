// EditSectorModal.js
import React, { useState } from 'react';
import ShortModal from '../ShortModal/ShortModal';
import api from '../../services/api';

function EditSectorModal({ sector, onSectorUpdated, onClose }) {
  const [sectorName, setSectorName] = useState(sector.sector_name || '');
  const [nameError, setNameError] = useState(null);

  const handleSectorUpdate = async (e) => {
    e.preventDefault();
    
    if (!sectorName.trim()) {
      setNameError('O nome do setor não pode estar vazio');
      return;
    }

    try {
      const response = await api.put(`/sector/${sector.sector_id}`, {
        sector_name: sectorName
      });
      
      onSectorUpdated(response.data);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar o setor:', error);
      setNameError('Erro ao atualizar o setor');
    }
  };

  return (
    <ShortModal
      title="Editar Setor"
      handleSubmit={handleSectorUpdate}
      closeModal={onClose}
    >
      <div className="form-control mb-4">
        <label className="label">Nome do Setor</label>
        <input
          type="text"
          className="p-[4px] poppins-medium shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded  text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
          value={sectorName}
          onChange={(e) => setSectorName(e.target.value)}
          required
        />
        {nameError && <p className="text-red-500 mt-1 text-xl font-pixel">{nameError}</p>}
      </div>
    </ShortModal>
  );
}

export default EditSectorModal;
