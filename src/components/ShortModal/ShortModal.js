import React from 'react'
import './ShortModal.css'

function Modal(props) {
  return (
    <div className="modal modal-open">
        <div className="modal-box bg-[#FFC376] shadow-[inset_-2px_5px_2px_2px_rgba(0,0,0,0.25)] border-8 border-[#D87B26] max-w-[32%] short-modal">
        <h3 className="font-bold text-lg alt-color-5">{props.title}</h3>

        <form onSubmit={props.handleSubmit}>
            {props.children}

            <div className="modal-action">
              <label htmlFor={props.modalName} className="px-5 py-1 quinteral-color-bg rounded poppins  shadow-md hvr-grow alt-color-5-bg tertiary-color cursor-pointer" onClick={props.closeModal}>Cancelar</label>
              <button type="submit" className="px-5 py-1 quarternary-color-bg rounded poppins shadow-md hvr-grow alt-color-5">Salvar</button>
            </div>
        </form>
        </div>
    </div>

  )
}

export default Modal
