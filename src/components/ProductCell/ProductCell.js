const ProductCell = ({ aoClickar,product }) => {
      
      const onProductClick = () => {
        aoClickar(product.product_id);
       
        
    }

    const abbreviateNumber =(value,bool) => {
        let newValue = value;
        const suffixes = ["", "Mil", "M", " Bi"," T"];
        const preffixes = ['','~','~','~','~']
        let suffixNum = 0;
        while (newValue >= 1000) {
          newValue /= 1000;
          suffixNum++;
        }
        
        
        newValue = newValue.toString().length > 3 ? newValue.toPrecision(4) : newValue.toPrecision(3);
      
        newValue += suffixes[suffixNum];
        bool===true?bool='R$ ':bool='';
        return bool + preffixes[suffixNum]+ ' ' + newValue;
      }
      
    return (
        <div onClick={onProductClick} className="flex rounded-md shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] justify-between flex-col bg-[#6B3710] hover:bg-[#3E1900] p-2 flex-wrap  text-[#FFC376]">
            <div className="w-[96px] h-[96px]  mx-auto " >
            <img src={product.product_img || '../../images/default.png'} alt={'image do produto:' + product.product_name} className={`  w-[96px] h-[96px]  ${product.product_img===null?'rounded-full':'rounded-full border-[0.25rem] border-[#D87B26]'}  bg-[#3E1900]   m-auto object-fill `} />
            </div>
            <div className="flex flex-col">
            <p className="poppins-semibold my-2">{product.product_name}</p>
            
            <p className="poppins-regular">{abbreviateNumber(product.product_stock) +" Und."}</p>
            <p className=" poppins-regular tracking-normal">{abbreviateNumber(product.prod_cost_value ,true)}</p>
            </div>
      
        </div>
    );
}
export default ProductCell;