import MainPage from '../MainPage/MainPage';

import ProductRow from '../../components/ProductRow/ProductRow2';
import ProductTable from '../../components/ProductTable/ProductTable2';
import api from '../../services/api';
import React, { useState, useEffect } from 'react'; // Importação dos hooks do React

// Página para registrar compra e venda de estoque
function BuyAndSell() {
  const [products, setProducts] = useState([]); // Estado para armazenar os dados dos produtos

  // Função para buscar os produtos
 

  return (
    <MainPage title="Compra e Venda">
      <div className="flex bg-[rgb(255,195,118)]  ">
        {/* Conteúdo */}
        <section className="border-0 border-[rgb(180,81,5)]    w-full shadow-sm shadow-inner">
          {/* Barra de pesquisa (componente que você pode personalizar se necessário) */}
          <ProductTable products={products} /> {/* Passando os produtos como prop para o ProductTable */}

          {/* Formulário de dados do fornecedor */}
          
        </section>
      </div>
    </MainPage>
  );
}

export default BuyAndSell;
