import React from 'react'

import { useState, useEffect } from 'react'
import api from '../../services/api'



function DropdownButtons({ options = [],type, label, onChange, disabled = false, padrao = true }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [anoantigo, setAnoantigo] = useState([]);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
  
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  })
  
  const opt =options;
  
  return (
    <div className='  w-full align-start'>
      <select
        className={`${windowWidth >500?'w-[8rem]': 'w-[90%]'} poppins-semibold border-4 rounded border-[#B45105] bg-[#FFC376] animated-placeholder`}

        name="dropdown"
        id="filtrodrop"
        onChange={onChange}
        disabled={disabled}

        
      >
        {padrao === true ? <option value="null"  >{label}</option> : ''}
        {type === 'ano' ? opt.map((option) => (
          <option key={option} value={option}>{option}</option>
        )) : options.map((option) => (<>
          
          <option key={option[`${type}_id`]} value={option[`${type}_id`]}>
            {option[`${type}_name`]}
          </option>
          </>

        ))}
      </select>
    </div>
  )
}

export default DropdownButtons
