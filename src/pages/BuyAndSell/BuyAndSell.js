import React from 'react'
import MainPage from '../MainPage/MainPage';

function BuyAndSell() {
  return (
    <MainPage title="BuyAndSell">
    <div className="flex border-4 border-[rgb(107,55,16)] bg-[rgb(255,195,118)] ">
      {/* Conteúdo */}
      <section className="border-4 border-[rgb(180,81,5)] h-full w-full shadow-sm shadow-inner">
        {/* Barra de pesquisa */}
        <div className="flex justify-between rounded-lg max-h-6 w-56 bg-[rgb(221,160,89)] m-2 ">
          <input className="h-6 rounded-lg w-[190px] bg-[rgb(221,160,89)] m-0" />
          <img className="relative h-6 mr-2 top-[2%]" src="lupa.png" alt="lupa" />
        </div>
        {/* Tabela */}
        <div className="m-4 pr-1 max-h-60 align-middle content-center self-center overflow-auto">
          <div className="flex vt323-regular justify-between mx-2">
            <p>Id</p>
            <p>Nome</p>
            <p>Categoria</p>
            <p>Un. de medida</p>
            <p>Preço</p>
            <p>Quantidade</p>
            <p>Estoque</p>
            <p>Estoque Mínimo</p>
          </div>

          <div className="flex vt323-regular justify-between px-2 w-full min-h-6 bg-[rgb(245,148,87)]">
            <p>0</p>
            <p>Banana</p>
            <p>Alimentos</p>
            <p>Kg</p>
            <p>1,90</p>
            <p>500</p>
            <p>1000</p>
            <p>700</p>
          </div>
          <div className="flex vt323-regular justify-between px-2 w-full min-h-6 bg-[rgb(245,166,109)]">
            <p>1</p>
            <p>Martelo</p>
            <p>Utensílios</p>
            <p>Kg</p>
            <p>10,90</p>
            <p>100</p>
            <p>500</p>
            <p>700</p>
          </div>
          {/* Linhas vazias */}
          <div className="w-full min-h-6 bg-[rgb(245,148,87)]"></div>
          <div className="w-full min-h-6 bg-[rgb(245,166,109)]"></div>
          <div className="w-full min-h-6 bg-[rgb(245,148,87)]"></div>
          <div className="w-full min-h-6 bg-[rgb(245,166,109)]"></div>
          <div className="w-full min-h-6 bg-[rgb(245,148,87)]"></div>
          <div className="w-full min-h-6 bg-[rgb(245,166,109)]"></div>
          {/* Repita o padrão conforme necessário */}
        </div>

        <div className="m-4">
          {/* Metade 1 */}
          <div className="flex justify-between">
            <div className="vt323-regular flex w-[45%] flex-col">
              {/* Descrição do Produto */}
              <div>
                <label htmlFor="descProd">Descrição do Produto :</label>
                <textarea
                  className="resize-none w-[100%] px-2 break-words border-[rgb(245,148,87)] border-8 h-16 bg-[rgb(245,148,87)]"
                  type="text"
                  name="descProd"
                ></textarea>
              </div>
              <div className="mt-2 pr-1 max-h-64 w-[100%] overflow-auto">
                {/* Título da Tabela */}
                <div className="flex vt323-regular px-2 justify-between">
                  <p>N° do Lote</p>
                  <p>Data da Compra</p>
                  <p>Validade</p>
                </div>

                <div className="flex vt323-regular justify-between px-2 w-full min-h-6 bg-[rgb(245,148,87)]">
                  <p>0</p>
                  <p>01/04/2024</p>
                  <p>12/10/2024</p>
                </div>
                <div className="flex vt323-regular justify-between px-2 w-full min-h-6 bg-[rgb(245,166,109)]">
                  <p>1</p>
                  <p>13/01/2022</p>
                  <p>22/07/2024</p>
                </div>
              </div>
            </div>

            {/* Metade 2 */}
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

              {/* Botões */}
              <div className="flex justify-between m-4">
                <button
                  id="Compra"
                  className="my-3 mx-1 vt323-regular bg-[#36571C] h-8 w-28 text-[rgb(244,189,118)] rounded border-4 border-black center"
                >
                  Compra
                </button>
                <button
                  id="Venda"
                  className="my-3 mx-1 vt323-regular bg-[#AF0909] h-8 w-28 text-[rgb(244,189,118)] rounded border-4 border-black center"
                >
                  Venda
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </MainPage>
  );
};

export default BuyAndSell