import React from 'react'

function Loading() {
  return (
    <div className='h-full w-full m-auto flex flex-col justify-center items-center'>
      <figure className='w-[3rem]'>
          <img src="img/loading.gif" alt=''/>
      </figure>
      <p className='font-pixel'>Carregando...</p>
    </div>
  )
}

export default Loading