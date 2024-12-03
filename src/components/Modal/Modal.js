import React from 'react'
import './Modal.css'

function Modal(props) {
  return (
    <div className="modal modal-open  ">
        <div className="modal-box bg-[#FFC376] flex shadow-[inset_-2px_5px_2px_2px_rgba(0,0,0,0.25)] border-8 border-[#D87B26]  long-modal">
        
        <form className='w-full overflow-y-scroll p-2 ' onSubmit={props.handleSubmit}>
        <h1 className="font-bold text-lg  alt-color-5 my-4 ">{props.title}</h1>

            {props.children}

            <div className="modal-action pb-2 ">
              <label htmlFor={props.modalName} className="px-5 py-1 quinteral-color-bg rounded poppins shadow-md hvr-grow alt-color-5-bg tertiary-color cursor-pointer" onClick={props.closeModal}>Cancelar</label>
              <button type="submit" className="px-5 py-1 quarternary-color-bg rounded poppins shadow-md hvr-grow alt-color-5">Salvar</button>
            </div>
            
        </form>
        </div>
    </div>

  )
}

export default Modal
