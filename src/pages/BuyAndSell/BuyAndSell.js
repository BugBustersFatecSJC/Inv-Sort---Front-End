import MainPage from '../MainPage/MainPage';

import ProductRow from '../../components/ProductRow/ProductRow2';
import ProductTable from '../../components/ProductTable/ProductTable2';

import React, { useState, useEffect } from 'react'; // Importação dos hooks do React
import Sidebari from '../../components/Sidebar/Sidebari';



function BuyAndSell() {
	const [products, setProducts] = useState([]);


	useEffect(() => {
		const fetchProducts = async () => {
			try {

				const res = await fetch('/api/products');
				if (!res.ok) {
					throw new Error('Falha ao buscar produtos');
				}
				const data = await res.json();
				setProducts(data);
			} catch (error) {
				console.error('Erro ao buscar produtos:', error);
			}
		};

		fetchProducts();
	}, []);

	return (<div className=''>

		<MainPage title="Compra e Venda">

			<div className="flex bg-[rgb(255,195,118)]  ">

				<section className="border-0 border-[rgb(180,81,5)] w-full shadow-inner">
					{/* Barra de pesquisa (componente que você pode personalizar se necessário) */}
					<ProductTable products={products} /> {/* Passando os produtos como prop para o ProductTable */}
				</section>
			</div>
		</MainPage>
	</div>
	);
}

export default BuyAndSell;
