import { useState, useEffect } from 'react';
import ProductRow from '../../components/ProductRow/ProductRow';
import api from '../../services/api';

const ProductTable = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="product-table w-full bg-[#FFC376] border-4 border-[#85450D]">
      <div className='border-4 border-[#B45105] p-6'>
        <h2 className="text-center font-pixel text-2xl mb-4 px-4 py-2">Frutas</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="">
              <th className=" text-xl font-pixel px-4 py-2">ID</th>
              <th className=" text-xl font-pixel px-4 py-2">Nome</th>
              <th className=" text-xl font-pixel px-4 py-2">Un. de medida</th>
              <th className=" text-xl font-pixel px-4 py-2">Quantidade</th>
              <th className=" text-xl font-pixel px-4 py-2">Estoque</th>
              <th className=" text-xl font-pixel px-4 py-2">Preço uni.</th>
              <th className=" text-xl font-pixel px-4 py-2">Qtd lotes</th>
            </tr>
          </thead>
          <tbody className=' border-4 border-[#b5651d]' >
            {products.map((product, index) => (
              <ProductRow
                key={index}
                product={product}
                bgColor={index % 2 === 0 ? "bg-[#F5A66D]" : "bg-[#EA9457]"}
              />
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button className="bg-[#362010] font-pixel border-4 border-black text-[#F4BD76] px-6 py-2 hover:bg-[#4b2b1f]">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;