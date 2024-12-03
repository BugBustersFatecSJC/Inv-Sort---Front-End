import React, { useState } from 'react';
import ShortModal from '../ShortModal/ShortModal';
import api from '../../services/api';

function EditLocalModal({ local, onLocalUpdated, onClose }) {
  const [localName, setLocalName] = useState(local.local_name || '');
  const [localAddress, setLocalAddress] = useState(local.local_address || '');
  const [formError, setFormError] = useState(null);

  const handleLocalUpdate = async (e) => {
    e.preventDefault();

    if (!localName.trim() || !localAddress.trim()) {
      setFormError('Nome e endereço do local não podem estar vazios');
      return;
    }

    try {
      const response = await api.put(`/local/${local.local_id}`, {
        local_name: localName,
        local_address: localAddress,
      });
      
      onLocalUpdated(response.data);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar o local:', error);
      setFormError('Erro ao atualizar o local');
    }
  };

  return (
    <ShortModal
      title="Editar Local"
      handleSubmit={handleLocalUpdate}
      closeModal={onClose}
    >
      <div className="form-control mb-4">
        <label className="label">Nome do Local</label>
        <input
          type="text"
          className="p-[4px] poppins-medium shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded  transition-all duration-[100ms] ease-in-out alt-color-5"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          required
        />
      </div>
      <div className="form-control mb-4">
        <label className="label">Endereço</label>
        <input
          type="text"
          className="p-[4px] poppins-medium shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded  transition-all duration-[100ms] ease-in-out alt-color-5"
          value={localAddress}
          onChange={(e) => setLocalAddress(e.target.value)}
        />
      </div>
      {formError && <p className="text-red-500 mt-1 text-xl font-pixel">{formError}</p>}
    </ShortModal>
  );
}

export default EditLocalModal;
