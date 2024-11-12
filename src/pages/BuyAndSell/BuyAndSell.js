import MainPage from '../MainPage/MainPage';

import ProductRow from '../../components/ProductRow/ProductRow2';
import ProductTable from '../../components/ProductTable/ProductTable2';

import React, { useState, useEffect } from 'react'; // Importação dos hooks do React

// Página para registrar compra e venda de estoque
function BuyAndSell() {
  const [products, setProducts] = useState([]); // Estado para armazenar os dados dos produtos

  // Função para buscar os produtos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products'); // Chama sua API para buscar os produtos
        const data = await res.json();
        setProducts(data); // Atualiza o estado com os dados dos produtos
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProducts(); // Chama a função para buscar os produtos ao carregar a página
  }, []);

  return (
    <MainPage title="Compra e Venda">

      <div className="flex bg-[rgb(255,195,118)]  ">
        
        <section className="border-0 border-[rgb(180,81,5)]    w-full shadow-sm shadow-inner">

          {/* Barra de pesquisa (componente que você pode personalizar se necessário) */}
          <ProductTable products={products} /> {/* Passando os produtos como prop para o ProductTable */}

          {/* Formulário de dados do fornecedor */}
          <div className="w-[50%]">
            <h1 className="vt323-regular pb-1">Fornecedor</h1>

            <div className="vt323-regular flex w-[100%] flex-col">
              <label htmlFor="nomeForn">Nome</label>
              <textarea
                className="resize-none w-[100%] px-2 break-words border-[rgb(245,166,109)] h-[24px] bg-[rgb(245,166,109)]"
                type="text"
                name="nomeForn"
              ></textarea>
            </div>

            <div className="vt323-regular flex w-[100%] justify-between">
              <div className="flex flex-col">
                <label htmlFor="telefoneForn" className="max-h-6 w-[100%]">
                  Telefone
                </label>
                <textarea
                  className="resize-none w-[50%] mx-4 px-2 break-words border-[rgb(245,148,87)] h-6 bg-[rgb(245,148,87)]"
                  type="text"
                  name="telefoneForn"
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label htmlFor="emailForn" className="max-h-6 w-[100%]">
                  Email
                </label>
                <textarea
                  className="resize-none w-[50%] mx-4 px-2 break-words border-[rgb(245,148,87)] h-6 bg-[rgb(245,148,87)]"
                  type="text"
                  name="emailForn"
                ></textarea>
              </div>
            </div>

            <div className="vt323-regular justify-between flex">
              <div className="flex flex-col w-20">
                <label htmlFor="logradouroForn" className="max-h-12 mr-2 w-[60%]">
                  Logradouro
                </label>
                <input
                  pattern="\d{5}-\d{3}"
                  maxLength="9"
                  className="resize-none w-[100%] px-2 break-words border-[rgb(245,148,87)] h-6 bg-[rgb(245,148,87)]"
                  type="text"
                  name="logradouroForn"
                />
              </div>

              <div className="flex flex-col justify-between flex-wrap">
                <label htmlFor="contatoForn" className="max-h-6 mx-1 w-[100%]">
                  Endereço
                </label>
                <div className="flex w-48">
                  <textarea
                    className="resize-none w-[85%] mx-1 px-2 break-words border-[rgb(245,148,87)] h-6 bg-[rgb(245,148,87)]"
                    type="text"
                    name="contatoForn"
                  ></textarea>
                  <p className="w-12">, N°</p>
                  <input
                    pattern="\d{4}"
                    maxLength="4"
                    className="resize-none w-[40px] ml-2 px-2 break-words border-[rgb(245,148,87)] h-6 bg-[rgb(245,148,87)]"
                    type="text"
                    name="contatoForn"
                  />
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>
    </MainPage>
  );
}

export default BuyAndSell;
