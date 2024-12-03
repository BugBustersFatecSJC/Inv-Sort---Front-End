import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './InitialSignUp.module.css';
import MainLogo from '../../components/MainLogo/MainLogo';
import Field from '../../components/Field/Field';
import SendButton from '../../components/SendButton/SendButton';
import Watermark from '../../components/Watermark/Watermark';
import api from '../../services/api';
import AnimatedBackground from '../../components/AnimatedBackground/AnimatedBackground';
import { UserContext } from '../../context/userContext';

function InitialSignUp() {
  const navigate = useNavigate();
  const { needsRegistration, setNeedsRegistration } = useContext(UserContext);

  useEffect(() => {
    if (!needsRegistration) {
      navigate('/');
    }
  }, [needsRegistration, navigate]);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState('');
  const userRole = 'admin';
  const userStatus = 'ativo';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userPassword !== userPasswordConfirmation) {
      alert('As senhas não conferem. Por favor, verifique novamente.');
      return;
    }

    const userData = {
      username: userName,
      email: userEmail,
      password: userPassword,
      role: userRole,
      status: userStatus,
    };

    try {
      await api.post('/users', userData);

      setUserName('');
      setUserEmail('');
      setUserPassword('');
      setUserPasswordConfirmation('');

      setNeedsRegistration(false);

      navigate('/login');
    } catch (err) {
      console.error('Erro ao cadastrar o usuário:', err);
      alert('Ocorreu um erro ao tentar criar o usuário. Tente novamente.');
    }
  };

  return (
    <div className={styles.mainContainer}>
      <AnimatedBackground />

      <form
        onSubmit={handleSubmit}
        className={`w-[32%] flex justify-center h-[550px] items-center rounded ${styles.formContainer}`}
      >
        <div className="w-[80%] flex flex-col items-center">
          <div className="mb-[50px]">
            <MainLogo />
          </div>

          <h2 className="text-center">
            Este é o primeiro acesso ao sistema, crie o administrador para começar
          </h2>

          <Field
            name="name"
            type="text"
            placeholder="Nome"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Field
            name="email"
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <Field
            name="password"
            type="password"
            placeholder="Senha"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <Field
            name="password_confirmation"
            type="password"
            placeholder="Confirmar senha"
            value={userPasswordConfirmation}
            onChange={(e) => setUserPasswordConfirmation(e.target.value)}
          />

          <div className="mt-[40px]">
            <SendButton text="ENVIAR" />
          </div>
        </div>
      </form>

      <div className="fixed bottom-0">
        <Watermark />
      </div>
    </div>
  );
}

export default InitialSignUp;
