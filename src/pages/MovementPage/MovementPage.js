import React from 'react'
import ProductTableMvSt from '../../components/ProductTable/ProductTableMvSt'
import MainPage from '../MainPage/MainPage'


function MovementPage() {
  
  return (
    <MainPage title="Movimentação de produtos">
      <div className='mt-4'>
        <ProductTableMvSt/>
      </div>
    </MainPage>
  )
}

export default MovementPage
