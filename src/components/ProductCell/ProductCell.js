import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import api from "../../services/api";
import FlashMessage from '../../components/FlashMessage/FlashMessage';
import ProductModal from "../ProductModal/ProductModal";

const ProductCell = ({ aoClickar, product }) => {

	const onProductClick = () => {
		aoClickar(product.product_id);
	}

	/**
   * Renderização da flash message
   */
	const [flash, setFlash] = useState(null)

	const showFlashMessage = (message, type) => {
		setFlash(null)
		setTimeout(() => {
			setFlash({ message, type })
		}, 0)
	}

	const flashSuccess = () => {
		showFlashMessage('Item adicionado com sucesso!', 'success');
	}

	const flashError = () => {
		showFlashMessage('Um erro aconteceu', 'error');
	};

	const flashInfo = () => {
		showFlashMessage('Item atualizado', 'info');
	}

	const flashDelete = () => {
		showFlashMessage('Item deletado', 'success');
	}

	const abbreviateNumber = (value, bool) => {
		let newValue = value;
		const suffixes = ["", "Mil", "M", " Bi", " T"];
		const preffixes = ['', '~', '~', '~', '~']
		let suffixNum = 0;
		while (newValue >= 1000) {
			newValue /= 1000;
			suffixNum++;
		}


		newValue = newValue.toString().length > 3 ? newValue.toPrecision(4) : newValue.toPrecision(3);

		newValue += suffixes[suffixNum];
		bool === true ? bool = 'R$ ' : bool = '';
		return bool + preffixes[suffixNum] + ' ' + newValue;
	}

	function moedaBrasileira(valor) {
		return valor.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		});
	}
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
			await fetchUnits()
			await fetchSuppliers()
			await fetchSector()
			await fetchLocals()
		}
		fetchData()
	}, [])

	const [isProdEditModalOpen, setIsProdEditModalOpen] = useState(false);
	const [currentProduct, setCurrentProduct] = useState(null);
	const parseCurrencyToFloat = (value) => {
		return parseFloat(value.replace("R$", "").replace(".", "").replace(",", "."));
	}
	const [productName, setProductName] = useState('');
	const [productDescription, setProductDescription] = useState('');
	const [productUnitId, setProductUnitId] = useState('');
	const [productSupplierId, setProductSupplierId] = useState('');
	const [productLocalId, setProductLocalId] = useState('');
	const [productSectorId, setProductSectorId] = useState('');
	const [isPerishable, setIsPerishable] = useState(false);
	const [productCostValue, setProductCostValue] = useState('');
	const [productSellValue, setProductSellValue] = useState('');
	const [productStock, setProductStock] = useState('');
	const [productStockMin, setProductStockMin] = useState('');
	const [quantityMax, setQuantityMax] = useState('');
	const [productImage, setProductImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [expirationDate, setExpirationDate] = useState('');
	const { id } = useParams();

	const openProdEditModal = () => {
		// setCurrentProduct(product);
		setProductName(product.product_name);
		setProductUnitId(product.unit_id);
		setProductSupplierId(product.supplier_id);
		setProductLocalId(product.supplier_id);
		setProductSectorId(product.supplier_id);
		setIsPerishable(product.is_perishable);
		setProductCostValue(product.prod_cost_value);
		setProductSellValue(product.prod_sell_value);
		setProductStock(product.product_stock);
		setProductStockMin(product.product_stock_min);
		setQuantityMax(product.quantity_max);

		const imageUrl = product.product_img ? `http://localhost:3001${product.product_img}` : null;
		setProductImage(imageUrl);
		setImagePreview(imageUrl);

		if (product.description === null) {
			setProductDescription('');
		}

		setIsProdEditModalOpen(true);
	};

	const closeProdEditModal = () => {
		setIsProdEditModalOpen(false);
		setCurrentProduct(null);
	};

	const handleProdUpdate = async (e) => {
		e.preventDefault();

		const updatedProductData = new FormData();
		updatedProductData.append('product_name', productName);
		updatedProductData.append('description', productDescription);
		updatedProductData.append('category_id', id);
		updatedProductData.append('supplier_id', productSupplierId);
		updatedProductData.append('is_perishable', isPerishable);
		updatedProductData.append('unit_id', productUnitId);
		updatedProductData.append("prod_cost_value", productCostValue);
		updatedProductData.append("prod_sell_value", productSellValue);
		updatedProductData.append('local_id', productLocalId);
		updatedProductData.append('sector_id', productSectorId);
		updatedProductData.append('product_stock', productStock);
		updatedProductData.append('product_stock_min', productStockMin);
		updatedProductData.append('quantity_max', quantityMax);

		if (productImage instanceof File) {
			updatedProductData.append('product_img', productImage);
		}

		try {
			await api
				.put(`/products/${product.product_id}`, updatedProductData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
				.then((response) => console.log(response));
			flashInfo();
			closeProdEditModal();
			window.location.reload()
		} catch (err) {
			console.log(err);
			flashError();
		}
	};

	const formatCurrency = (value) => {
		const formattedValue = parseFloat(value.replace(/[^\d]/g, '') / 100).toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		});
		return formattedValue;
	};

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
		<div className="flex rounded-md shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] justify-between flex-col bg-[#6B3710] pt-3 flex-wrap  text-[#FFC376]">
			<div className="flex justify-between my-2">
				<div className="w-[40%]">
					<img
						src={product.product_img ? `http://localhost:3001${product.product_img}` : '../../images/default.png'}
						alt={`Imagem do produto: ${product.product_name}`}
						className={`w-[96px] h-[96px] ${product.product_img === null ? 'rounded-full' : 'rounded-full border-[0.25rem] border-[#D87B26]'} bg-[#3E1900] m-auto object-fill`}
					/>
				</div>
				<div className="flex flex-col w-[58%]">
					<p className="poppins-semibold text-left my-2 text-[1.15rem]">{product.product_name}</p>
					<p className="poppins-regular text-left text-sm">Estoque atual: {product.product_stock}</p>
					<p className=" poppins-regular tracking-normal text-left text-sm">{moedaBrasileira(product.prod_cost_value)}</p>
				</div>
			</div>
			<div className="flex justify-evenly mx-auto mt-4 alt-color-5-bg w-full">
				<p className="cursor-pointer border-r border-[#D87B26] w-[50%] hover:bg-[#D87B26] hover:text-white hover:font-bold transition-all duration-300 ease-in-out p-1" onClick={onProductClick}>Ver</p>
				<p className="cursor-pointer w-[50%] hover:bg-[#D87B26] hover:text-white hover:font-bold transition-all duration-300 ease-in-out p-1" onClick={openProdEditModal}>Editar</p>
			</div>

			{/* Modal para editar produto */}
			{isProdEditModalOpen && (
				<ProductModal closeModal={closeProdEditModal} title="Editar Produto" handleSubmit={handleProdUpdate}>
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
										const file = e.target.files[0]
										if (file) {
											setProductImage(file)
											setImagePreview(URL.createObjectURL(file))
										}
									}}
									name="product-image"
								/>
								{imagePreview ? (
									<img src={imagePreview} alt="preview da imagem" className="w-full h-full z-0 absolute object-cover inset-0" />
								) : (
									<i className="fa-solid fa-plus text-5xl cursor-pointer alt-color-5"></i>
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
									value={productName}
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
										onChange={(e) => setProductStockMin(e.target.value.replace(/\D/g, ''))}
									/>
									<input
										type="text"
										className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5 w-[30%] placeholder-color"
										name="expiration_date"
										value={productStock}
										placeholder='Atual'
										onChange={(e) => setProductStock(e.target.value.replace(/\D/g, ''))}
									/>
									<input
										type="text"
										className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5 w-[30%] placeholder-color"
										name="expiration_date"
										value={quantityMax}
										placeholder='Máximo'
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

			{/* Componente flash message, verifica se o estado flash é true e então renderiza a flash message */}
			{flash && (
				<FlashMessage
					message={flash.message}
					type={flash.type}
					duration={3000}
					onClose={() => setFlash(null)}
				/>
			)}
		</div>
	);
}
export default ProductCell;