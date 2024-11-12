const ProductCell = ({ product }) => {
    const abbreviateNumber =(value,bool) => {
        let newValue = value;
        const suffixes = ["", "Mil", "M", " Bi"," T"];
        const preffixes = ['','~','~','~','~']
        let suffixNum = 0;
        while (newValue >= 1000) {
          newValue /= 1000;
          suffixNum++;
        }
        console.log(newValue,'newValue');
        
        newValue = newValue.toString().length > 3 ? newValue.toPrecision(4) : newValue.toPrecision(3);
      
        newValue += suffixes[suffixNum];
        bool===true?bool='R$ ':bool='';
        return bool + preffixes[suffixNum]+ ' ' + newValue;
      }
      
    return (
        <div className="flex rounded-md shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] justify-between flex-col bg-[#6B3710] hover:bg-[#3E1900] p-2 flex-wrap  text-[#FFC376]">
            <div className="w-12 h-12 sm:w-24 sm:h-24 mb-2 mx-auto " >
            <img src={product.product_img || '../../images/default.png'} alt={'image do produto:' + product.product_name} className={`  sm:w-24 sm:h-24 ${product.product_img===null?'rounded-full':'rounded-full border-[0.25rem] border-[#D87B26]'}  bg-[#3E1900]   m-auto object-fill `} />
            </div>
            <div className="flex flex-col">
            <p className="poppins-semibold my-2">{product.product_name}</p>
            
            <p className="poppins-regular">{abbreviateNumber(product.product_stock*10000) +" Und."}</p>
            <p className=" poppins-regular tracking-normal">{abbreviateNumber(product.prod_cost_value*1000,true)}</p>
            </div>
      
        </div>
    );
}
export default ProductCell;