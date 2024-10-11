import React from 'react'

function Modal(props) {
  return (
    <div className="modal modal-open text-slate-400">
        <div className="modal-box">
        <h3 className="font-bold text-lg text-white">{props.title}</h3>

        <form onSubmit={props.handleSubmit}>
            {props.children}

            <div className="modal-action">
            <label htmlFor={props.modalName} className="btn" onClick={props.closeModal}>Cancelar</label>
            <button type="submit" className="btn btn-primary">Salvar</button>
            </div>
        </form>
        </div>
    </div>

  )
}

export default Modal
