import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/check-first-login')
      .then(response => {
        if (response.data.needsRegistration) {
          navigate('/cadastro');
        } else {
          navigate('/login');
        }
      })
      .catch(error => {
        console.error("Erro ao verificar usuários:", error);
      });
  }, [navigate]);

  return null;
}

export default RedirectHandler;
