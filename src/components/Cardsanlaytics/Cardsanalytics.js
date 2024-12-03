import api from '../../services/api';
import { useState, useEffect } from 'react';
const Cardsanalytics = ({text,label,data,datacor,prefix='',sufix=''}) => {

    // Iterated from: https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
    
    return (
        
       
            <span className="flex w-full    my-2 flex-col ">
            <h1 className='poppins-medium text-start text-[12px] text-[#6B3710] w-full px-1'>{text}</h1>
            <div className="h-[40px] w-full pl-1 align-middle flex items-center self-center justify-between  border-4 rounded border-[#B45105] bg-[#FFC376] ">
                <p className="align-middle poppins-semibold  ">{label}</p>
                <p className={`text-sm poppins-bold bg-[#B45105] text-[rgb(255,195,118)] tracking-wider p-1 content-center  my-auto h-full text-${datacor}`}>{prefix+data+sufix}</p>
            </div>

        </span>
       
  
    )
}


export default Cardsanalytics;