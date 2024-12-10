import { useState } from 'react'
import api from '../../services/api'
import FlashMessage from '../../components/FlashMessage/FlashMessage'
import ShortModal from '../ShortModal/ShortModal'
import './Category.css'
import Modal from '../Modal/Modal'
import './Category.css'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { motion } from 'framer-motion'

function Category(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [nameError, setNameError] = useState(null);
    const [flash, setFlash] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setCategoryName('');
        setImagePreview(null);
        setNameError(null);
    };

    const flashSuccess = () => setFlash({ message: 'Item adicionado com sucesso!', type: 'success' });
    const flashError = () => setFlash({ message: 'Um erro aconteceu', type: 'error' });
    const flashDelete = () => {
        setFlash({ message: 'Item deletado', type: 'success' });
    }

    /**
     * Form para enviar os dados da categoria
     */
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!cropper) return;

    //     // Obtém a imagem recortada em Blob
    //     cropper.getCroppedCanvas().toBlob((blob) => {
    //         const formData = new FormData();
    //         formData.append("category_name", categoryName);
    //         formData.append("category_image", blob, "category_image.png");
    //         console.log(blob)

    //         try {
    //             api
    //                 .post("/category", formData, {
    //                     headers: { "Content-Type": "multipart/form-data" },
    //                 })
    //                 .then((response) => props.onCategoryAdded(response.data));

    //             setCategoryName("");
    //             setCategoryImage(null);
    //             setImageSrc(null);
    //             setCroppedImage(null);
    //             closeModal();
    //             flashSuccess();
    //         } catch (err) {
    //             console.log(err);
    //             flashError();
    //         }
    //     });
    // };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("category_name", categoryName);
        if (imagePreview) {
            const response = await fetch(imagePreview);
            const blob = await response.blob();
            formData.append("category_image", blob, "category_image.png");
        }

        try {
            const response = await api.post("/category", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            props.onCategoryAdded(response.data);
            console.log(response.data);

            closeModal();
            flashSuccess();
        } catch (err) {
            console.error(err);
            if (err.response?.status === 400 && err.response.data.error.code === 'P2002') {
                setNameError("Esta categoria já existe");
            }
            flashError();
        }
    };

    return (
        <>
            <motion.div
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={openModal}
                className="w-full alt-color-6-bg rounded shadow-md cursor-pointer h-[200px]"
            >
                <div className="flex flex-col items-center justify-center h-full">
                    <motion.i
                        className="fa-solid fa-plus text-4xl"
                        variants={{
                            hover: { scale: 1.4 },
                        }}
                    ></motion.i>
                    <p className="mt-4 text-center">Adicionar categoria</p>
                </div>
            </motion.div>

            {isModalOpen && (
                <ShortModal
                    title="Criar categoria"
                    handleSubmit={handleSubmit}
                    modalName="cria-categoria"
                    closeModal={closeModal}
                >
                    <div className="w-full flex flex-col items-center mt-4">
                        <label className='label'>Imagem da categoria</label>
                        <div
                            className="bg-[#FFC376] p-[1rem] h-[14rem] w-[14rem] flex items-center justify-center border-8 border-[#D87B26] cursor-pointer mt-4 shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] shadow-[inset_-2px_5px_2px_2px_rgba(0,0,0,0.25)] relative"
                            onClick={() => document.getElementById('category-image-input').click()}
                        >
                            <input
                                type="file"
                                id="category-image-input"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="preview da imagem"
                                    className="w-full h-full z-0 absolute object-cover inset-0"
                                />
                            ) : (
                                <i className="fa-solid fa-plus text-5xl cursor-pointer alt-color-5"></i>
                            )}
                        </div>
                    </div>
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
                        {nameError && <p className="text-red-500 mt-1 text-xl font-pixel">{nameError}</p>}
                    </div>
                </ShortModal>
            )}

            {flash && (
                <FlashMessage
                    message={flash.message}
                    type={flash.type}
                    duration={3000}
                    onClose={() => setFlash(null)}
                />
            )}
        </>
    );
}

export default Category;
