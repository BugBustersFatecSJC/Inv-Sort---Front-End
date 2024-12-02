import React, { useEffect } from 'react'
import Loading from '../Loading/Loading'
import { useState } from 'react'
import 'react-tippy/dist/tippy.css'
import './ModalProduct.css' 
import api from '../../services/api'


function ModalProducts(props) {
  const [modal, setIsModal] = useState(1);
  const [locals, setLocals] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [localActive, setLocalActive] = useState('');
  const [qtdBuy, setQtdBuy] = useState('');
  const [expirationBuy, setExpirationBuy] = useState('');
  const [qtdSell, setQtdSell] = useState('');
  const [expirationSell, setExpirationSell] = useState('');
    const [editProd, setEditProd] = useState({
      product_name: '',
      product_stock: '',
      product_stock_min: '',
      prod_cost_value: '',
      prod_sell_value: '',
      product_perishable: '',
      expiration_date: ''
    })
    const activelocal = (e) => {
      console.log('evento',e);
      
      setLocalActive(e.target.value)
    }
    useEffect(() => {
      const fetchSectors = async () => {
        const setores = await api.get('/sector')
        setSectors(setores.data)
  
      }
      const fetchLocals = async () => {
        const locais = await api.get('/local')
        
        setLocals(locais.data)
      }
      fetchLocals()
      fetchSectors()
    },[])
    console.log('localactive',editProd);
    
    const { productInfo } = props
    
    
    const inputmodal = 'p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded poppins-medium my-1 transition-all duration-[100ms] ease-in-out alt-color-5'
    const inputmodaledit = 'w-full p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded poppins-medium my-1 transition-all duration-[100ms] ease-in-out alt-color-5'
    
    const editarProd = async () => {
      const prod_nome = document.getElementById('prod_nome').value;
      const edit_stock = document.getElementById('edit_stock').value;
      const edit_stock_min = document.getElementById('edit_stock_min').value;
      const edit_cost_value = document.getElementById('edit_cost_value').value;
      const edit_sell_value = document.getElementById('edit_sell_value').value;
      const edit_perishable = document.getElementById('edit_perishable').checked;
      const edit_expiration_date = document.getElementById('edit_expiration_date').value;
    
      const updatedProduct = {
        product_name: prod_nome,
        product_stock: edit_stock,
        product_stock_min: edit_stock_min,
        prod_cost_value: edit_cost_value,
        prod_sell_value: edit_sell_value,
        product_perishable: edit_perishable,
        expiration_date: edit_expiration_date,
      };
      console.log(updatedProduct);
      
      try {
        const result = await api.put(`/products/${productInfo.product_id}`, updatedProduct);
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };
    
    const editModal = () => {
      setIsModal(0)
    }
    const buyModal = () => {
      setIsModal(2)
    }
    const sellModal = () => {
      setIsModal(3)
    } 
    const handleBuy = async () => {
      if (!qtdBuy) {
          alert('Preencha a quantidade!');
          return;
      }

      const payload = {
          product_id: productInfo.product_id,
          quantity: qtdBuy,
          expiration_date: productInfo.is_perishable ? expirationBuy : null,
      };

      try {
          const result = await api.post(`/buyandsell/buy/${productInfo.product_id}`, payload);
          console.log(result.data);
          alert('Compra registrada com sucesso!');
      } catch (error) {
          console.error(error);
          alert('Erro ao registrar compra!');
      }
  };

  const handleSell = async () => {
      if (!qtdSell) {
          alert('Preencha a quantidade!');
          return;
      }

      const payload = {
          product_id: productInfo.product_id,
          quantity: qtdSell,
          expiration_date: productInfo.is_perishable ? expirationSell : null,
      };

      try {
          const result = await api.post(`/buyandsell/sell/${productInfo.product_id}`, payload);
          console.log(result.data);
          alert('Venda registrada com sucesso!');
      } catch (error) {
          console.error(error);
          alert('Erro ao registrar venda!');
      }
  };

    if (modal == 1){
      return (
    
        <div className='flex w-full flex-wrap   ' >
         
        <div className='flex mx-auto   w-32 h-32 sm:w-38 sm:h-38'>
        <p className='cursor-pointer text-[#6B3710] absolute  right-4 top-4 rounded-full flex w-8 h-8 text-center align-middle bg-[#6B3710]' style={{ color: "var(--tertiary-color)" }} ><i onClick={editModal} className="fa-solid m-auto  fa-pencil"></i></p>
          <img src={productInfo.product_img || '../../images/default.png'} alt={'image do produto:' + productInfo.product_name} className={`   ${productInfo.product_img===null?'rounded-full':' rounded-full border-[0.25rem] border-[#D87B26]'} text-start  bg-[#3E1900]   m-auto object-fill `} />
          
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
            <div  className='flex py-[2px] flex-col'>
            {productInfo.batches ? productInfo.batches.map((batch,index) => {
                
                return (
                  <div key={batch.batch_id} className={`py-2 w-full flex grid grid-cols-5 ${index % 2 === 0 ? "bg-[#F5A66D]" : "bg-[#EA9457]"}`}>
                  <p className='col-span-1 text-center'>{batch.batch_id}</p>
                  <p className='col-span-2 text-center'>{batch.expiration_date}</p>
                  <p className='col-span-2 text-center'>{batch.quantity}</p>
                </div>
                )
                
              }): <Loading/>}
            
            </div>
          </div>
          <div  className='flex py-[2px] flex-col'>
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
    
    
          
          
          <p className={'mt-2'}> É perecível :</p>
          <p className={inputmodaledit + "cursor-pointer label"}>{productInfo.product_perishable ? 'Sim' : 'Não'}</p>
          <div className='my-4 flex justify-center '>
          <a onClick={buyModal} className="bg-[#30551A] cursor-pointer mx-1 px-3 py-2 text-white rounded-md" >Comprar</a>
          <a onClick={sellModal} className="bg-[#8B2121]  cursor-pointer mx-1 px-3 py-2 text-white rounded-md">Vender</a>
          <label htmlFor={props.modalName} className="px-5 ml-auto py-2 quinteral-color-bg rounded-md poppins align-middle my-auto shadow-md hvr-grow alt-color-5-bg tertiary-color cursor-pointer" onClick={props.closeModal}>Cancelar</label>

          </div>
      </div>
      </div>
    
        
    </div>
      )
    }
    else if (modal == 0){
      return (
    
        <div className='flex w-full flex-wrap   ' >
         
        <div className='flex mx-auto   w-32 h-32 sm:w-38 sm:h-38'>
          <img src={productInfo.product_img || '../../images/default.png'} alt={'image do produto:' + productInfo.product_name} className={`   ${productInfo.product_img===null?'rounded-full':' rounded-full border-[0.25rem] border-[#D87B26]'} text-start  bg-[#3E1900]   m-auto object-fill `} />
          
        </div>
        <form onSubmit={editarProd} className='w-full mt-10 sm:mt-0  '>
          
         
          
          
          <div>
          <p> Nome : </p>
          <input id='prod_nome' className={inputmodaledit } placeholder={'Und...'}/>

          <p> Estoque Mínimo : </p>
          <input id='edit_stock_min' className={inputmodaledit} placeholder={'Und...'}/>
          <p> Valor de custo : </p>
          <input id='edit_cost_value' className={inputmodaledit} placeholder={'R$...'}/>
          <p> Valor de venda : </p>
          <input id='edit_sell_value' className={inputmodaledit} placeholder={'R$...'}/>
          <p> Quantidade máxima por lote : </p>
          <input id='edit_sell_value' className={inputmodaledit} placeholder={'R$...'}/>
          </div>
           
          {locals && sectors ? (
  <>
     <p>Local:</p>
    <select
      id="edit_local"
      onChange={activelocal}
      className={inputmodaledit}
      aria-label="Selecione um Local"
    >
      <option value="">Escolha um local</option>
      {locals.map((local) => (
        <option key={local.local_id} value={local.local_id}>
          {local.local_name}
        </option>
      ))}
    </select>
      <p>Setor:</p>
    <select
      id="edit_sector"
      className={inputmodaledit}
      aria-label="Selecione um Setor"
    >
      
      {localActive
        ?<>
        {sectors
            .filter((sector) => sector.local_id == localActive)
            .map((sector) => (
              <option key={sector.sector_id} value={sector.sector_id}>
                {sector.sector_name}
              </option>
            ))}
          </> 
        : 
        <option disabled> Escolha um local</option> }
    </select>
  </>
) : (
  <Loading />
)}
            
            
          <div className="form-control my-1">
          <label className={inputmodaledit + "cursor-pointer label"}>
            <span className=" text-[#da9d54] ">É perecível?</span>
            <input
              id='edit_perishable'
              type="checkbox"
              className="toggle toggle-primary"
              placeholder='É perecível'
      
            />
          </label>
        </div>

        <div className="form-control mb-4">
        
          <p className=" text-[#6B3710] poppins ">Data de Validade</p>
          
          <input
            id='edit_expiration_date'
            type="date"
            className={inputmodaledit + "cursor-pointer label  text-[#da9d54]"}
            color='#da9d54'
            name="expiration_date"
            
          />
        </div>

            <div className='my-4 flex justify-center '>
            
                <div className="modal-action pb-2 ">
                  <label htmlFor={props.modalName} className="px-5 py-2 quinteral-color-bg rounded-md poppins align-middle my-auto shadow-md hvr-grow alt-color-5-bg tertiary-color cursor-pointer" onClick={props.closeModal}>Cancelar</label>
                  <button type="submit" className="px-5 py-2 quarternary-color-bg rounded-md  poppins align-middle my-auto shadow-md hvr-grow alt-color-5">Salvar</button>
                </div>
            </div>
          
      </form>
    
        
    </div>
      )
    }
    else if (modal == 2){
     return (
      <div className='flex w-full flex-wrap  '>
      <h1>Registro de Compra</h1>
      <input
          type="number"
          placeholder="Quantidade"
          value={qtdBuy}
          className={inputmodaledit}
          onChange={(e) => setQtdBuy(e.target.value)}
      />
      {productInfo.is_perishable && (
          <input
              type="date"
              value={expirationBuy}
              className={inputmodaledit}
              onChange={(e) => setExpirationBuy(e.target.value)}
          />
      )}
      <button  className='px-5 py-2 quarternary-color-bg rounded-md  poppins align-middle my-auto shadow-md hvr-grow alt-color-5' onClick={handleBuy}>Finalizar Compra</button>
      <button className='px-5 py-2 quinteral-color-bg rounded-md poppins align-middle my-auto shadow-md hvr-grow alt-color-5-bg tertiary-color cursor-pointer' onClick={() => setIsModal(1)}>Cancelar</button>
  </div>
     )
  }
  else if (modal === 3) {
     return (
      <div>
      <h1>Registro de Venda</h1>
      <input
          type="number"
          placeholder="Quantidade"
          value={qtdSell}
          className={inputmodaledit}
          onChange={(e) => setQtdSell(e.target.value)}
      />
      {productInfo.is_perishable && (
          <input
              type="date"
              value={expirationSell}
              className={inputmodaledit}
              onChange={(e) => setExpirationSell(e.target.value)}
          />
      )}
      <button className='px-5 py-2 quarternary-color-bg rounded-md  poppins align-middle my-auto shadow-md hvr-grow alt-color-5' onClick={handleSell}>Finalizar Venda</button>
      <button className='px-5 py-2 quinteral-color-bg rounded-md poppins align-middle my-auto shadow-md hvr-grow alt-color-5-bg tertiary-color cursor-pointer' onClick={() => setIsModal(1)}>Cancelar</button>
  </div>
     )
  }
};


export default ModalProducts;