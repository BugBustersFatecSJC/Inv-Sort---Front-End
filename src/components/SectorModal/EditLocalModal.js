import { useState, useEffect } from 'react';
import api from '../../services/api';
import FlashMessage from '../../components/FlashMessage/FlashMessage';

function EditLocalModal({ localId, onClose }) {
  const [localName, setLocalName] = useState('');
  const [localAddress, setLocalAddress] = useState('');
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    const fetchLocal = async () => {
      try {
        const response = await api.get(`/local/${localId}`);
        setLocalName(response.data.local_name);
        setLocalAddress(response.data.local_address);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocal();
  }, [localId]);

  const showFlashMessage = (message, type) => {
    setFlash({ message, type });
    setTimeout(() => setFlash(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/local/${localId}`, { local_name: localName, local_address: localAddress });
      showFlashMessage('Local atualizado com sucesso!', 'success');
      onClose(); // Fecha o modal
    } catch (err) {
      console.error(err);
      showFlashMessage('Erro ao atualizar o local', 'error');
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Editar Local</h3>

        {flash && <FlashMessage message={flash.message} type={flash.type} />}

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">Nome do Local</label>
            <input
              type="text"
              className="input input-bordered"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">Endereço</label>
            <input
              type="text"
              className="input input-bordered"
              value={localAddress}
              onChange={(e) => setLocalAddress(e.target.value)}
              required
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLocalModal;
