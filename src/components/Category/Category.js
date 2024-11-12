import { useState, useEffect } from 'react'
import api from '../../services/api'
import FlashMessage from '../../components/FlashMessage/FlashMessage'
import Modal from '../Modal/Modal'
import './Category.css'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";


function Category(props) {
    /**
     * Lógica para o modal
     */
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [categoryName, setCategoryName] = useState('')
    const [categoryImage, setCategoryImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [nameError, setNameError] = useState(null)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => {
        setIsModalOpen(false)
        setCategoryName('')
        setCategoryImage(null)
        setNameError(null)
    }

    const [imageSrc, setImageSrc] = useState(null); // Imagem original carregada
    const [croppedImage, setCroppedImage] = useState(null); // Imagem recortada
    const [cropper, setCropper] = useState(null); // Instância do Cropper


    /**
     * Renderização da flash message
     */
    const [flash, setFlash] = useState(null)

    const flashSuccess = () => {
        setFlash({ message: 'Item adicionado com sucesso!', type: 'success' });
    }

    const flashError = () => {
        setFlash({ message: 'Um erro aconteceu', type: 'error' });
    };

    const flashInfo = () => {
        setFlash({ message: 'Item atualizado', type: 'info' });
    }

    const flashDelete = () => {
        setFlash({ message: 'Item deletado', type: 'success' });
    }

    /**
     * Form para enviar os dados da categoria
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!cropper) return;
    
        // Obtém a imagem recortada em Blob
        cropper.getCroppedCanvas().toBlob((blob) => {
            const formData = new FormData();
            formData.append("category_name", categoryName);
            formData.append("category_image", blob, "category_image.png");
            console.log(blob)
    
            try {
                api
                    .post("/category", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then((response) => props.onCategoryAdded(response.data));
    
                setCategoryName("");
                setCategoryImage(null);
                setImageSrc(null);
                setCroppedImage(null);
                closeModal();
                flashSuccess();
            } catch (err) {
                console.log(err);
                flashError();
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
    
    return (
        <>
            <div onClick={openModal} className='w-full alt-color-6-bg rounded shadow-md mt-4 mb-[40px] cursor-pointer'>
                <div className='p-[1rem] h-[200px] flex flex-col items-center justify-center'>
                    <i class="fa-solid fa-plus text-4xl"></i>
                    <p className='mt-4'>Adicionar categoria</p>
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    title="Criar categoria"
                    handleSubmit={handleSubmit}
                    modalName="cria-categoria"
                    closeModal={closeModal}
                >
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text alt-color-5">Nome da categoria</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Digite o nome da categoria"
                            className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
                            required
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            name="category-name"
                        />
                    </div>

                    <div className="form-control mb-4">
                        <label className="label" htmlFor="category-image">
                            <span className="label-text alt-color-5">Selecione uma imagem</span>
                        </label>
                        <input
                            type="file"
                            className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
                            onChange={handleImageChange}
                            name="category-image"
                        />
                    </div>

                    {imageSrc && (
                        <Cropper
                            src={imageSrc}
                            style={{ height: 400, width: "100%" }}
                            // Configurações do Cropper.js
                            aspectRatio={1}
                            guides={false}
                            onInitialized={(instance) => setCropper(instance)}
                        />
                    )}
                </Modal>
            )}

            {/* Componente flash message, verifica se o estado flash é true e então renderiza a flash message */}
            {flash && (
                <FlashMessage
                    message={flash.message}
                    type={flash.type}
                    duration={3000}
                    onClose={() => setFlash(null)}
                />
            )}
        </>
    )
}

export default Category
