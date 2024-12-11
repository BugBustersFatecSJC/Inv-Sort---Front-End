import React from 'react'
function Modalsbtn(props) {
    return (
      <div className="modal modal-open  ">
          <div className="modal-box bg-[#FFC376] flex shadow-[inset_-2px_5px_2px_2px_rgba(0,0,0,0.25)] border-8 border-[#D87B26]  long-modal" style={{padding: 0}}>
          
          <form className='w-full overflow-y-scroll p-2 ' onSubmit={props.handleSubmit}>
          <h1 className="font-bold text-lg  alt-color-5 my-4 ">{props.title}</h1>
              {props.children}
          </form>
          </div>
      </div>
  
    )
  }
  
  
  export default Modalsbtn
