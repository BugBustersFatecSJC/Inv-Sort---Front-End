import React, { useState, useContext } from "react";
import MainPage from "../MainPage/MainPage";
import { UserContext } from "../../context/userContext";
import api from "../../services/api";

function UserProfile() {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState(user?.username || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);  // Para armazenar a imagem selecionada

  const handleEdit = async () => {
    console.log("Iniciando edição de usuário...");
    console.log("Enviando dados:", { user_id: user.user_id, username });
  
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    try {
      const response = await api.put(`/users/${user.user_id}`, { username });
      console.log("Resposta da API:", response.data);
      setUser({ ...user, username: response.data.username });
      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error("Erro na requisição:", err.response || err.message);
      setError("Erro ao atualizar o nome. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);  // Armazena o arquivo real
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("user_img", image);  // Envia o arquivo real como 'file'

      // Ajuste a URL conforme a API do seu backend
      const response = await api.put(`/users/${user.user_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Imagem atualizada com sucesso:", response.data);
      setUser({ ...user, user_img: response.data.user_img }); // Atualiza o usuário com a nova imagem
      setSuccess(true);
    } catch (err) {
      console.error("Erro ao carregar a imagem:", err);
      setError("Erro ao atualizar a imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainPage title="Perfil">
      <div className="p-4">
        <div className="flex flex-col items-center">
          {/* Exibição de imagem do usuário ou imagem padrão */}
          <img
            src={user?.user_img || "https://via.placeholder.com/150"}
            alt="User"
            className="w-40 h-40 rounded-full mb-4 border-4 border-[#6B3710] object-cover"
          />

          {/* Botão para alterar imagem */}
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="bg-[#6B3710] text-[#FFC376] px-4 py-2 rounded cursor-pointer">
              Alterar ou Inserir Foto
            </label>
            {image && (
              <button
                onClick={handleImageUpload}
                className="mt-2 bg-[#6B3710] text-[#FFC376] px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Carregando..." : "Salvar Imagem"}
              </button>
            )}
          </div>

          <div className="text-center mt-4">
            <h2 className="text-xl font-bold mb-2">{user?.role}</h2>
            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded p-2 w-full mb-2 bg-[#F4E1C1] text-[#6B3710] poppins-semibold"
              />
            ) : (
              <h3 className="text-lg text-[#6B3710]">{user?.username}</h3>
            )}
          </div>

          <div className="mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="bg-[#6B3710] text-[#FFC376] px-4 py-2 rounded transition-all hover:bg-[#C17B46] disabled:bg-[#E5C1A2]"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded transition-all hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#6B3710] text-[#FFC376] px-4 py-2 rounded transition-all hover:bg-[#C17B46]"
              >
                Editar Nome
              </button>
            )}
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">Atualizado com sucesso!</p>}
        </div>
      </div>
    </MainPage>
  );
}

export default UserProfile;
