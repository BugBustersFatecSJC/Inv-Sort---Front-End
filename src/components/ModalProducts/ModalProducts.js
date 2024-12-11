import React from 'react'
import Loading from '../Loading/Loading'
import { useState } from 'react'
import 'react-tippy/dist/tippy.css'
import './ModalProduct.css'
function ModalProducts(props) {
	const [modal, setIsModal] = useState(1);
	const { productInfo } = props
	const inputmodal = 'p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded poppins-medium my-1 transition-all duration-[100ms] ease-in-out alt-color-5'
	const inputmodaledit = 'w-full p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded poppins-medium my-1 transition-all duration-[100ms] ease-in-out alt-color-5'

	const editModal = () => {
		setIsModal(0)
	}
	if (modal == 1) {
		return (
			<div className='flex w-full flex-wrap'>
				<div className='flex mx-auto w-32 h-32 sm:w-38 sm:h-38'>
					{props.closeButton}
					<img src={productInfo.product_img != null ? `http://localhost:3001${productInfo.product_img }` : '/img/default.png'} alt={'image do produto:' + productInfo.product_name} className={`   ${productInfo.product_img === null ? 'rounded-full' : ' rounded-full border-[0.25rem] border-[#D87B26]'} h-[8rem] w-[8rem] text-start  bg-[#3E1900]   m-auto object-fill `} />

				</div>
				<div className='w-full mt-10 sm:mt-0  '>
					<div>
						<p> Estoque : </p>
						<p className={inputmodal}>{productInfo.product_stock} Un.</p>
						<p> Estoque Mínimo : </p>
						<p className={inputmodal}>{productInfo.product_stock_min} Un.</p>
						<p> Valor de custo : </p>
						<p className={inputmodal}>R$ {productInfo.prod_cost_value}</p>
						<p> Valor de venda : </p>
						<p className={inputmodal}> R$ {productInfo.prod_sell_value}</p>
					</div>
					<div>
						<h1 className='text-xl my-2'>Lotes:</h1>
						<div className='mt-4 flex grid grid-cols-5 bg-[#6B3710] text-white'>
							<p className='col-span-1 text-center'>Id</p>
							<p className='col-span-2 text-center'>Validade</p>
							<p className='col-span-2 text-center'>Quantidade</p>
						</div>
						<div className='flex py-[2px] flex-col'>
							{productInfo.batches ? productInfo.batches.map((batch, index) => {

								return (
									<div key={batch.batch_id} className={`py-2 w-full flex grid grid-cols-5 ${index % 2 === 0 ? "bg-[#F5A66D]" : "bg-[#EA9457]"}`}>
										<p className='col-span-1 text-center'>{batch.batch_id}</p>
										<p className='col-span-2 text-center'>{batch.expiration_date}</p>
										<p className='col-span-2 text-center'>{batch.quantity}</p>
									</div>
								)

							}) : <Loading />}

						</div>
					</div>
					<div className='flex py-[2px] flex-col'>
						<h1 className='text-xl my-2'>Fornecedores:</h1>
						<div className=' flex grid grid-cols-6 bg-[#6B3710] text-white'>
							<p className='col-span-2 text-center'>Nome</p>
							<p className='col-span-2 text-center'>Contato</p>
							<p className='col-span-2 text-center'>Endereço</p>
						</div>
						<div>
							<div key={productInfo.supplier.supplier_id} className={`py-2 bg-[#F5A66D] w-full flex grid grid-cols-6 `}>
								<p className='col-span-2 text-center'>{productInfo.supplier.supplier_name}</p>
								<p className='col-span-2 text-center'>{productInfo.supplier.contact_info}</p>
								<p className='col-span-2 text-center'>{productInfo.supplier.address}</p>
							</div>
						</div>
						<p className='mt-2'> É perecível :</p>
						<p className={inputmodal}>{productInfo.product_perishable ? 'Sim' : 'Não'}</p>
						<div className='my-4 flex justify-center '>
							<a className="bg-[#30551A] cursor-pointer mx-1 px-3 py-2 text-white rounded-md" >Comprar</a>
							<a
								className="bg-[#8B2121]  cursor-pointer mx-1 px-3 py-2 text-white rounded-md"
							>
								Vender
							</a>
						</div>
					</div>
				</div>


			</div>
		)
	}
	else if (modal == 0) {
		return (
			<div className='flex w-full flex-wrap   ' >
				<div className='flex mx-auto   w-32 h-32 sm:w-38 sm:h-38'>
					<img src={productInfo.product_img || '../../images/default.png'} alt={'image do produto:' + productInfo.product_name} className={`   ${productInfo.product_img === null ? 'rounded-full' : ' rounded-full border-[0.25rem] border-[#D87B26]'} text-start  bg-[#3E1900]   m-auto object-fill `} />
				</div>
				<form className='w-full mt-10 sm:mt-0  '>
					<div>
						<p> Estoque : </p>
						<input className={inputmodaledit} placeholder={'Un.'} />

						<p> Estoque Mínimo : </p>
						<input className={inputmodaledit} placeholder={'Un.'} />
						<p> Valor de custo : </p>
						<input className={inputmodaledit} placeholder={'R$'} />
						<p> Valor de venda : </p>
						<input className={inputmodaledit} placeholder={'R$'} />
					</div>
					<div className="form-control my-1">
						<label className={inputmodaledit + "cursor-pointer label"}>
							<span className=" text-[#6B3710] ">É perecível</span>
							<input
								type="checkbox"
								className="toggle toggle-primary"


							/>
						</label>
					</div>

					<div className="form-control mb-4">
						<label className="label">
							<span className="label-text  text-[#6B3710]">Data de Validade</span>
						</label>
						<input
							type="date"
							className={inputmodaledit + "cursor-pointer label"}
							name="expiration_date"

						/>
					</div>

					<div className='my-4 flex justify-center '>

						<div className="modal-action pb-2 ">
							<label htmlFor={props.modalName} className="px-5 py-1 quinteral-color-bg rounded font-pixel text-2xl shadow-md hvr-grow alt-color-5-bg tertiary-color cursor-pointer" onClick={props.closeModal}>Cancelar</label>
							<button type="submit" className="px-5 py-1 quarternary-color-bg rounded font-pixel text-2xl shadow-md hvr-grow alt-color-5">Salvar</button>
						</div>
					</div>

				</form>


			</div>
		)
	}
	else {
		return (
			<div className='flex w-full flex-wrap   ' >
				<div className='flex mx-auto   w-32 h-32 sm:w-38 sm:h-38'>
					<img src={productInfo.product_img || '../../images/default.png'} alt={'image do produto:' + productInfo.product_name} className={`   ${productInfo.product_img === null ? 'rounded-full' : ' rounded-full border-[0.25rem] border-[#D87B26]'} text-start  bg-[#3E1900]   m-auto object-fill `} />
				</div>
				<div className='w-full mt-10 sm:mt-0  '>
					<div>
						<p> Estoque : </p>
						<p className={inputmodal}>{productInfo.product_stock} Un.</p>
						<p> Estoque Mínimo : </p>
						<p className={inputmodal}>{productInfo.product_stock_min} Un.</p>
						<p> Valor de custo : </p>
						<p className={inputmodal}>R$ {productInfo.prod_cost_value}</p>
						<p> Valor de venda : </p>
						<p className={inputmodal}> R$ {productInfo.prod_sell_value}</p>
					</div>
					<div>
						<h1 className='text-xl my-2'>Lotes:</h1>
						<div className='mt-4 flex grid grid-cols-5 bg-[#6B3710] text-white'>
							<p className='col-span-1 text-center'>Id</p>
							<p className='col-span-2 text-center'>Validade</p>
							<p className='col-span-2 text-center'>Quantidade</p>
						</div>
						<div className='flex py-[2px] flex-col'>
							{productInfo.batches ? productInfo.batches.map((batch, index) => {

								return (
									<div key={batch.batch_id} className={`py-2 w-full flex grid grid-cols-5 ${index % 2 === 0 ? "bg-[#F5A66D]" : "bg-[#EA9457]"}`}>
										<p className='col-span-1 text-center'>{batch.batch_id}</p>
										<p className='col-span-2 text-center'>{batch.expiration_date}</p>
										<p className='col-span-2 text-center'>{batch.quantity}</p>
									</div>
								)

							}) : <Loading />}

						</div>
					</div>
					<div className='flex py-[2px] flex-col'>
						<h1 className='text-xl my-2'>Fornecedores:</h1>
						<div className=' flex grid grid-cols-6 bg-[#6B3710] text-white'>
							<p className='col-span-2 text-center'>Nome</p>
							<p className='col-span-2 text-center'>Contato</p>
							<p className='col-span-2 text-center'>Endereço</p>
						</div>
						<div>
							<div key={productInfo.supplier.supplier_id} className={`py-2 bg-[#F5A66D] w-full flex grid grid-cols-6 `}>
								<p className='col-span-2 text-center'>{productInfo.supplier.supplier_name}</p>
								<p className='col-span-2 text-center'>{productInfo.supplier.contact_info}</p>
								<p className='col-span-2 text-center'>{productInfo.supplier.address}</p>
							</div>
						</div>

						<p className='mt-2'> É perecível :</p>
						<p className={inputmodal}>{productInfo.product_perishable ? 'Sim' : 'Não'}</p>
						<div className='my-4 flex justify-center '>
							<a className="bg-[#30551A] cursor-pointer mx-1 px-3 py-2 text-white rounded-md" >Comprar</a>
							<a
								className="bg-[#8B2121]  cursor-pointer mx-1 px-3 py-2 text-white rounded-md"
							>
								Vender
							</a>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ModalProducts