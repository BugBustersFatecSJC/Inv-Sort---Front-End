import React, { useState, useEffect, useRef } from 'react';
import './DraggableModal.css'; // Adicione estilos para o modal

function DraggableModal({ onClose, children, onSubmit }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const modalRef = useRef(null);

    const startDrag = (e) => {
        setIsDragging(true);
        modalRef.current.startX = e.clientX - position.x;
        modalRef.current.startY = e.clientY - position.y;
    };

    const onDrag = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - modalRef.current.startX,
            y: e.clientY - modalRef.current.startY,
        });
    };

    const endDrag = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onDrag);
            window.addEventListener('mouseup', endDrag);
        } else {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', endDrag);
        }
        return () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', endDrag);
        };
    }, [isDragging]);

    return (
        <form className="draggable-modal-overlay" onSubmit={onSubmit}>
            <div
                className="draggable-modal"
                ref={modalRef}
                style={{ top: `${position.y}px`, left: `${position.x}px` }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div
                    className="draggable-modal-header"
                    onMouseDown={startDrag}
                >
                    Movimentação
                </div>
                <div className="draggable-modal-content">
                    {children}
                </div>
                <div className='w-full flex justify-end px-[20px] pb-4'>
                    <button onClick={onClose} className="px-5 py-1 quinteral-color-bg rounded font-pixel text-2xl shadow-md hvr-grow alt-color-5-bg tertiary-color cursor-pointer">
                        Cancelar
                    </button>
                    <button type="submit" className="ml-5 px-5 py-1 quarternary-color-bg rounded font-pixel text-2xl shadow-md hvr-grow alt-color-5">
                        Enviar
                    </button>
                </div>
            </div>
        </form>
    );
}

export default DraggableModal;
