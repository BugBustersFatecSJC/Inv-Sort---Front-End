import React from 'react';
//Fluxo de Estoque, Usado No Buy And Sell
const ProductRow = ({ product, bgColor }) => {
  return (
    <span className={``}>
     
      <p className="">{product.product_name}</p>
    
      <p className="border border-orange-400 p-2">{product.quantity}</p>
      <p className="border border-orange-400 p-2">{product.stock}</p>
      <p className="border border-orange-400 p-2">{product.prod_cost_value}</p>
      
    </span>
  );
};

export default ProductRow;
