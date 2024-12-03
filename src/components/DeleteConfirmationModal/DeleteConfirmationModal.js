import React from 'react';
import './DeleteConfirmationModal.css';

function DeleteConfirmationModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box bg-[#FFC376] shadow-[inset_-2px_5px_2px_2px_rgba(0,0,0,0.25)] border-8 border-[#D87B26] max-w-[32%] short-modal">
        <h3 className="font-bold text-lg alt-color-5">{title}</h3>
        <p className="text-md my-4 alt-color-5">{message}</p>
        <div className="modal-action">
          <button
            onClick={onCancel}
            className="px-5 py-1 quinteral-color-bg rounded font-pixel text-2xl shadow-md hvr-grow alt-color-5-bg tertiary-color cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-1 quarternary-color-bg rounded font-pixel text-2xl shadow-md hvr-grow alt-color-5"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
