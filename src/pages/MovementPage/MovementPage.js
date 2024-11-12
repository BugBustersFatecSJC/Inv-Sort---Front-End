import React from 'react'
import ProductTableMvSt from '../../components/ProductTable/ProductTableMvSt'
import MainPage from '../MainPage/MainPage'

function MovementPage() {
  return (
    <MainPage title="Movimentação de produtos" className="min-h-screen bg-gray-50">
      <div className='mt-4'>

        <div className="overflow-x-auto">
          <ProductTableMvSt />
        </div>

      </div>
    </MainPage>
  )
}

export default MovementPage
