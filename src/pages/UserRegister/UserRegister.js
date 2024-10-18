import { useState } from 'react';
import api from "../../services/api"; // Certifique-se de que o caminho está correto
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate
import Field from "../../components/Field/Field"; // Importa seu componente de input
import MainPage from '../MainPage/MainPage'; // Se precisar do layout da página

function UserRegister() {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('ativo'); // Estado para o status
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const registerUser = async (event) => {
        event.preventDefault();

        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            const response = await api.post('/users', {
                username: name,
                role: role,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                status: status,
            });

            // Atualize a mensagem de sucesso aqui
            setSuccess("Usuário cadastrado com sucesso!");
            console.log('Usuário cadastrado:', response.data.user);

            // Redirecionar após um atraso (opcional)
            setTimeout(() => {
                navigate('/user-register');
            }, 2000); // Atraso de 2 segundos
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao cadastrar usuário.');
            console.error(err);
        }
    };


    return (
        <MainPage title="Cadastre usuário">
            <form onSubmit={registerUser} className="flex flex-col md:flex-row items-center md:items-start mt-4">
                <div
                    className="bg-[#FFC376] p-[1rem] h-[290px] w-[290px] flex items-center justify-center border-[12px] border-[#D87B26] cursor-pointer"
                >
                    <i className="fa-solid fa-plus text-5xl cursor-pointer"></i>
                </div>

                <div className="flex flex-col w-full mt-2 md:ml-4">
                    <div className="flex flex-col md:flex-row w-full">
                        <div className="flex flex-col w-full md:w-1/2 mr-4">
                            <label className="mb-1 text-4xl font-pixel">Nome</label>
                            <Field
                                name="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-[70.87px] border rounded p-2 border-[#D87B26] font-family:'VT323'"
                                required
                            />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2">
                            <label className="mb-1 text-4xl font-pixel">Cargo</label>
                            <Field
                                name="role"
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full h-[70.87px] border rounded p-2 border-[#D87B26] font-family:'VT323'"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-full mt-2">
                        <label className="mb-1 text-4xl font-pixel">Email</label>
                        <Field
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[70.87px] border rounded p-2 border-[#D87B26] font-family:'VT323'"
                            required
                        />
                    </div>
                    <div className="flex flex-col w-full mt-2">
                        <label className="mb-1 text-4xl font-pixel">Senha</label>
                        <Field
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-[70.87px] border rounded p-2 border-[#D87B26] font-family:'VT323'"
                            required
                        />
                    </div>
                    <div className="flex flex-col w-full mt-2">
                        <label className="mb-1 text-4xl font-pixel">Confirmar Senha</label>
                        <Field
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-[70.87px] border rounded p-2 border-[#D87B26] font-family:'VT323'"
                            required
                        />
                    </div>
                    <div className="flex flex-col w-full mt-2">
                        <label className="mb-1 text-4xl font-pixel">Status</label>
                        <select
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full h-[70.87px] border rounded p-2 border-[#D87B26] font-family:'VT323'"
                            required
                        >
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
                    <button type="submit" className="mt-4 p-2 bg-[#FFC376] rounded border border-[#D87B26] hover:bg-[#D87B26] hover:text-white transition duration-300">Registrar</button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && <p className="text-green-500 mt-2">{success}</p>}
                </div>
            </form>
        </MainPage>
    );
}

export default UserRegister;
