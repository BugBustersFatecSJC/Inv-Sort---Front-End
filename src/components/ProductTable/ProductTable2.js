import { useState, useEffect } from 'react';
import ProductCell from '../ProductCell/ProductCell';
import { useParams } from 'react-router-dom';
import Modalsbtn from '../Modal/Modalsbtn';
import Loading from '../Loading/Loading';
import api from '../../services/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'; // Icones da Filtragem
import ModalProducts from '../ModalProducts/ModalProducts';
import ProductModal from '../ProductModal/ProductModal';
import SearchBar from '../SearchBarAlt/SearchBarAlt';
import Pagination from '../Pagination/Pagination';

const ProductTable = () => {
    const [modal, setIsModalOpen] = useState(false);
    const [productname, setProductName] = useState('');
    const [productId, setProductId] = useState('');
    const [productInfo, setProductInfo] = useState('');
    const [nameError, setNameError] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [flash, setFlash] = useState('');

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 20 for desktop


    const { id } = useParams();
    console.log(productInfo);

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/category/' + id);
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.log(err);
        }
    };

    // Filter products based on search term
    const filterProducts = (products) => {
        return products.filter((product) => {
            if (searchTerm === '') return true;
            return product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    // Handle search input change
    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    // Update filtered products when search term changes
    useEffect(() => {
        setFilteredProducts(filterProducts(products));
    }, [searchTerm, products]);

    // Determine items per page based on screen size (mobile vs desktop)
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth <= 768) {
                setItemsPerPage(6); // Mobile (6 items per page)
            } else {
                setItemsPerPage(15); // Desktop (20 items per page)
            }
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);

        return () => {
            window.removeEventListener('resize', updateItemsPerPage);
        };
    }, []);

    const openModal = (product_id) => {
        setProductId(product_id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setProductName('');
        setImagePreview(null);
        setNameError(null);
    };

    const flashSuccess = () => setFlash({ message: 'Item adicionado com sucesso!', type: 'success' });
    const flashError = () => setFlash({ message: 'Um erro aconteceu', type: 'error' });
    const flashDelete = () => setFlash({ message: 'Item deletado', type: 'success' });

    useEffect(() => {
        const fetchProductInfo = async () => {
            if (!productId) return;

            try {
                const response = await api.get(`/product/${productId}`);
                setProductInfo(response.data);
                flashSuccess();
            } catch (err) {
                console.error(err);
                if (err.response?.status === 400 && err.response.data.error.code === 'P2002') {
                    setNameError('Este produto já existe');
                }
                flashError();
            }
        };

        fetchProductInfo();
    }, [productId]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    /**
   * Retorna todas as unidades
   */
    const [units, setUnits] = useState([])

    const fetchUnits = async () => {
        try {
            await api
                .get('/unit')
                .then(response => setUnits(response.data))
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Retorna todos os fornecedores
    */

    const [suppliers, setSuppliers] = useState([])

    const fetchSuppliers = async () => {
        try {
            await api
                .get('/supplier')
                .then(response => setSuppliers(response.data))
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Retorna todos os setores
    */

    const [sectors, setSector] = useState([])

    const fetchSector = async () => {
        try {
            await api
                .get('/sector')
                .then(response => setSector(response.data))
        } catch (err) {
            console.log(err)
        }
    }

    const [local, setLocals] = useState([])

    const fetchLocals = async () => {
        try {
            await api
                .get('/local')
                .then(response => setLocals(response.data))
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Hook de useEffect para ativar as funções quando o componente é renderizado
     */
    useEffect(() => {
        const fetchData = async () => {
            // setLoading(true)
            await fetchUnits()
            await fetchSuppliers()
            await fetchProducts()
            await fetchSector()
            await fetchLocals()
        }
        fetchData()
    }, [])

    useEffect(() => {
        fetchProducts();
    }, [id]);

    console.log('products', productInfo);

    /**
   * Abre e fecha o modal de produtos
   */
    const [registerModal, setRegisterModal] = useState(false)
    const openRegisterModal = () => setRegisterModal(true)
    const closeRegisterModal = () => {
        setProductName('')
        setProductDescription('')
        setProductUnitId('')
        setProductSupplierId('')
        setIsPerishable(false)
        setProductSellValue('')
        setProductCostValue('')
        setProductSectorId('')
        setProductLocalId('')
        setProductBrand('')
        setProductModel('')
        setProductImage(null)
        setProductStock('')
        setProductStockMin('')
        setQuantityMax('')
        setRegisterModal(false)
    }

    /**
     * Registra o produto
     */
    const [productDescription, setProductDescription] = useState(null)
    const [productUnitId, setProductUnitId] = useState('')
    const [productSupplierId, setProductSupplierId] = useState('')
    const [isPerishable, setIsPerishable] = useState(false)
    const [productBrand, setProductBrand] = useState('')
    const [productModel, setProductModel] = useState('')
    const [productCostValue, setProductCostValue] = useState('')
    const [productSellValue, setProductSellValue] = useState('')
    const [productLocalId, setProductLocalId] = useState('')
    const [productSectorId, setProductSectorId] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [productImage, setProductImage] = useState(null)
    const [productStock, setProductStock] = useState(null)
    const [productStockMin, setProductStockMin] = useState(null)
    const [quantityMax, setQuantityMax] = useState(null)

    const handleProductRegistration = async (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append('product_name', productname);
        formData.append('description', productDescription);
        formData.append('category_id', id);
        formData.append('supplier_id', productSupplierId);
        formData.append('is_perishable', isPerishable);
        formData.append('unit_id', productUnitId);
        formData.append('prod_model', productModel);
        formData.append('prod_brand', productBrand);
        formData.append("prod_cost_value", parseCurrencyToFloat(productCostValue));
        formData.append("prod_sell_value", parseCurrencyToFloat(productSellValue));
        formData.append('local_id', productLocalId);
        formData.append('sector_id', productSectorId);
        formData.append('product_stock', parseInt(productStock));
        formData.append('product_stock_min', parseInt(productStockMin));
        formData.append('quantity_max', parseInt(quantityMax));
        if (productImage) {
            formData.append('product_img', productImage);
        }

        try {
            await api.post("/products", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => { setProducts((prevProducts) => [response.data, ...prevProducts]) })


            setProductName('')
            setProductDescription('')
            setProductUnitId('')
            setProductSupplierId('')
            setIsPerishable(false)
            setProductSellValue('')
            setProductCostValue('')
            setProductSectorId('')
            setProductLocalId('')
            setProductBrand('')
            setProductModel('')
            setProductImage(null)
            setProductStock('')
            setProductStockMin('')
            setQuantityMax('')
            closeModal()
            flashSuccess()
        } catch (err) {
            console.log(err)
            flashError()
        }
    }

    const formatCurrency = (value) => {
        const formattedValue = parseFloat(value.replace(/[^\d]/g, '') / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return formattedValue;
    };

    const parseCurrencyToFloat = (value) => {
        return parseFloat(value.replace("R$", "").replace(".", "").replace(",", "."));
    }

    useEffect(() => {
        if (productImage instanceof File) {
            const previewUrl = URL.createObjectURL(productImage)
            setImagePreview(previewUrl)
            return () => URL.revokeObjectURL(previewUrl)
        } else if (typeof productImage === 'string') {
            setImagePreview(productImage)
        } else {
            setImagePreview(null)
        }
    }, [productImage])

    return (
        <div className="product-table max-h-[70%]">
            <div className='w-full flex justify-between'>
                <div onClick={openRegisterModal} className='font-pixel text-2xl cursor-pointer p-2 bg-[#008148] rounded text-white'>Adicionar produto</div>
                <SearchBar onSearch={handleSearch} />
            </div>
            <div className="flex grid mt-4 overflow-y-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 text-center justify-center flex-wrap gap-2 p-1">
                {currentItems.map((product, index) => (
                    <ProductCell aoClickar={openModal} product={product} key={index} />
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Modal to display product information */}
            {modal && (
                <Modalsbtn closeModal={closeModal} title={productInfo.product_name} modalName="cria-categoria" >
                    {productInfo ? <ModalProducts productInfo={productInfo} closeButton={
                        <p
                            className='cursor-pointer text-[#6B3710] absolute right-8 top-6 rounded-full flex w-8 h-8 text-center align-middle bg-red-500'
                            style={{ color: 'var(--tertiary-color)' }}
                            onClick={closeModal}
                        >
                            <i className="fa-solid m-auto fa-times"></i>
                        </p>
                    } /> : <Loading />}
                </Modalsbtn>
            )}

            {/* Modal de produto */}
            {registerModal && (
                <ProductModal closeModal={closeRegisterModal} title="Adicionar novo produto" handleSubmit={handleProductRegistration}>
                    <div className='flex justify-between modal-main-container'>
                        <div className='w-[20%]'>
                            <div
                                className="bg-[#FFC376] p-[1rem] h-[14rem] w-[14rem] flex items-center justify-center border-8 border-[#D87B26] cursor-pointer mt-4 shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] shadow-[inset_-2px_5px_2px_2px_rgba(0,0,0,0.25)] relative"
                                onClick={() => document.getElementById('product-image-input').click()}
                            >
                                <input
                                    type="file"
                                    id="product-image-input"
                                    className="hidden"
                                    onChange={(e) => {
                                        setProductImage(e.target.files[0]);
                                    }}
                                    name="product-image"
                                />
                                <i className="fa-solid fa-plus text-5xl cursor-pointer alt-color-5"></i>

                                {imagePreview && (
                                    <div className="mt-4">
                                        <img src={imagePreview} alt="preview da imagem" className="w-full h-full z-0 absolute object-cover inset-0" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='w-[38%]'>
                            <div className="form-control mb-4 w-full">
                                <label className="label">
                                    <span className="label-text alt-color-5">Nome do produto</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Digite o nome do produto"
                                    className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
                                    required
                                    name='product_name'
                                    value={productname}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text alt-color-5">Unidade</span>
                                </label>
                                <select
                                    value={productUnitId}
                                    onChange={(e) => setProductUnitId(parseInt(e.target.value))}
                                    className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
                                >
                                    <option disabled value="">Selecionar unidade</option>
                                    {units.map((unit) => (
                                        <option key={unit.unit_id} value={unit.unit_id}>{unit.unit_type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text alt-color-5">Fornecedor</span>
                                </label>
                                <select
                                    value={productSupplierId}
                                    onChange={(e) => setProductSupplierId(parseInt(e.target.value))}
                                    className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
                                >
                                    <option disabled value="">Selecionar fornecedor</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.supplier_id} value={supplier.supplier_id}>{supplier.supplier_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex justify-between preco-container'>
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text alt-color-5">Preço de Custo</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Digite o preço de custo"
                                        className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
                                        required
                                        name='cost_price'
                                        value={productCostValue}
                                        onChange={(e) => setProductCostValue(formatCurrency(e.target.value))}
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text alt-color-5">Preço de Venda</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Digite o preço de venda"
                                        className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
                                        required
                                        name='sell_price'
                                        value={productSellValue}
                                        onChange={(e) => setProductSellValue(formatCurrency(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="form-control mb-4 w-full">
                                <label className="cursor-pointer label">
                                    <span className="label-text alt-color-5">É perecível</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary bg-[#F8B971] checked:bg-[#B45105] checked:border-[#F8B971] rounded-[5px]"
                                        checked={isPerishable}
                                        onChange={(e) => setIsPerishable(e.target.checked)}
                                    />
                                </label>
                            </div>

                            {isPerishable && (
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text alt-color-5">Data de Validade</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
                                        name="expiration_date"
                                        value={expirationDate}
                                        onChange={(e) => setExpirationDate(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className='w-[38%]'>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text alt-color-5">Local</span>
                                </label>
                                <select
                                    value={productLocalId}
                                    onChange={(e) => setProductLocalId(parseInt(e.target.value))}
                                    className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
                                >
                                    <option disabled value="">Selecionar local</option>
                                    {local.map((local) => (
                                        <option key={local.local_id} value={local.local_id}>{local.local_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text alt-color-5">Setor</span>
                                </label>
                                <select
                                    value={productSectorId}
                                    onChange={(e) => setProductSectorId(parseInt(e.target.value))}
                                    className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5"
                                >
                                    <option disabled value="">Selecionar setor</option>
                                    {sectors.map((sector) => (
                                        <option key={sector.sector_id} value={sector.sector_id}>{sector.sector_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text alt-color-5">Estoque</span>
                                </label>
                                <div className='flex justify-between'>
                                    <input
                                        type="text"
                                        className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5 w-[30%] placeholder-color"
                                        name="expiration_date"
                                        value={productStockMin}
                                        placeholder='Mínimo'
                                        required
                                        onChange={(e) => setProductStockMin(e.target.value.replace(/\D/g, ''))}
                                    />
                                    <input
                                        type="text"
                                        className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5 w-[30%] placeholder-color"
                                        name="expiration_date"
                                        value={productStock}
                                        placeholder='Atual'
                                        required
                                        onChange={(e) => setProductStock(e.target.value.replace(/\D/g, ''))}
                                    />
                                    <input
                                        type="text"
                                        className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5 w-[30%] placeholder-color"
                                        name="expiration_date"
                                        value={quantityMax}
                                        placeholder='Máximo'
                                        required
                                        onChange={(e) => setQuantityMax(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>

                                <div className="form-control mb-4 mt-4 w-full">
                                    <label className="label ">
                                        <span className="label-text alt-color-5">Descrição (Opcional)</span>
                                    </label>
                                    <textarea
                                        placeholder="Digite a descrição do produto"
                                        className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5 placeholder-color"
                                        name='description'
                                        value={productDescription}
                                        onChange={(e) => setProductDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </ProductModal>
            )}
        </div>
    );
};

export default ProductTable;