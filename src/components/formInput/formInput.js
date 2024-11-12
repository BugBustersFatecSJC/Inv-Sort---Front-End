import React from 'react';
const FormInput=({props})=>{
    
    const handleChange=(event)=>{
        const valor = event.target.value
         props = valor
        
    }
    return(
        <div>
            <p>Nome do Fornecedor</p>
            <input placeholder='Nome...'>
                
            </input>
        </div>
    )
}
export default FormInput