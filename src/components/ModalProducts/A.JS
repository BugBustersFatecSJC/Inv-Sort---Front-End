
<div className='flex w-full flex-wrap   ' >
<div className='flex mx-auto   w-32 h-32 sm:w-38 sm:h-38'>
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
    <div  className='flex py-[2px]'>
    {productInfo.batch ? productInfo.batch.map((batch) => (
        <div key={batch.batch_id} className={`py-2 w-full flex grid grid-cols-5 ${batch.batch_id % 2 === 0 ? "bg-[#F5A66D]" : "bg-[#EA9457]"}`}>
          <p className='col-span-1 text-center'>{batch.batch_id}</p>
          <p className='col-span-2 text-center'>{batch.expiration_date}</p>
          <p className='col-span-2 text-center'>{batch.quantity}</p>
        </div>
        
      )): <Loading/>}
    
  </div>

  
  
  <p className='mt-2'> É perecível :</p>
  <p className={inputmodal}>{productInfo.product_perishable ? 'Sim' : 'Não'}</p>
</div>
</div>


</div>