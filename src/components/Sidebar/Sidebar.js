
import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Watermark from '../Watermark/Watermark';
import CategoryButtons from '../../components/CategoryButtons/CategoryButtons';

function Sidebari({ role, content }) {
  console.log('Current user role:', role);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth > 640) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [windowWidth]);
  const collapsedId = document.getElementById('collapse');
  return (

    <>
    <div className={` flex ${windowWidth > 640 ? 'max-w-[14rem]' : windowWidth > 450 ? 'max-w-[4rem] ' : 'max-w-[0rem]' } bg-clip-border alt-color-bg   `}>
      
      <div className='mb-8 justify-center self-center flex-col flex-wrap  w-full h-full  align-center text-center  py-4'>
        <div className='text-center self-center  align-middle flex justify-center'>
          {windowWidth > 450 ? <img  src={'img/logo_invsort.svg'}className={`w-[50%] sm:w-[30%] ${windowWidth<450?'rounded-m outline-4 outline-[#3E1900] bg-[#3E1900]':''}  mt-4 sb-button z-10`}  onClick={() => {if (windowWidth > 640) {
              setCollapsed(!collapsed);
              
            } else {
              setToggled(!toggled);
              
            }
          }} alt=""/>
           : null}
            
        </div>
        {props.content}
        <div className="mt-[40px] w-full flex justify-center"> 
       
      <Sidebar  className='text-center m-auto '   onBackdropClick={() => setToggled(false)} toggled={toggled} breakPoint="always" 
          >
      <Menu 
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            // only apply styles on first level elements of the tree
            
            if (level === 0)
              return {
                color: 'rgb(255,195,118)',
                [`&.active`]: {
                  backgroundColor: '#B45105',
                  color: '#b6c8d9',
                },
                [`&:hover`]: {
                  backgroundColor: '#3E1900'
                  
                }

                
              }
              
          ;},
          
        }}
      className='mb-12 p-4' >
        
    <MenuItem className='MenuItem w-full poppins-semibold ' icon={<img id='carrinho'  src="/images/grocery-store.png" />} component={<Link to="/products" />}>Produtos</MenuItem>
    <MenuItem className='MenuItem poppins-semibold ' icon={<img id='chart' className='' src="/images/pie-chart.png" />} component={<Link to="/analytics" />}>Análise </MenuItem>
    <MenuItem className='MenuItem poppins-semibold ' icon={<img id='chart' src="/images/arrows.png" />} component={<Link to="/stockmovements" />}> Movimentações </MenuItem>
    <MenuItem className='MenuItem poppins-semibold ' icon={<img className='' id='chart' src="/images/profile.png" />} component={<Link to="/userpage" />}> Gerenciar </MenuItem>
  </Menu>
  
  <Watermark  className="bottom-0"/>
        
</Sidebar>
{windowWidth > 450 ? <Sidebar id='collapse' width='14rem' className='' collapsedWidth='4rem ' collapsed={!collapsed}>
<Menu 
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
           
            
            if (level === 0)
              return {
                color: 'rgb(255,195,118)',
                [`&.active`]: {
                  backgroundColor: '#B45105',
                  color: '#b6c8d9',
                },
                [`&:hover`]: {
                  backgroundColor: '#3E1900'
                  
                }
                
              }
              
          ;},
        }}
      className='mb-12 w-full flex justify-center ' >
        
    <MenuItem className='MenuItem w-full poppins-semibold ' title='Produtos' icon={<img id='carrinho' alt='produtos'   src="/images/grocery-store.png" />} component={<Link to="/products" />}>{windowWidth>640?'Produtos':''}</MenuItem>
    <MenuItem className='MenuItem poppins-semibold ' title='Analise' icon={<img id='chart' className='' src="/images/pie-chart.png" />} component={<Link to="/analytics" />}>{windowWidth>640?'Analise':''} </MenuItem>
    <MenuItem className='MenuItem poppins-semibold '  title='Movimentações' icon={<img id='chart' src="/images/arrows.png" />} component={<Link to="/stockmovements" />}> {windowWidth>640?'Movementações':''} </MenuItem>
    <MenuItem className='MenuItem poppins-semibold '  title='Gerenciar' icon={<img className='' id='chart' src="/images/profile.png" />} component={<Link to="/e-commerce" />}> {windowWidth>640?'Gerenciar':''}</MenuItem>
</Menu>
      </Sidebar> : null}

          

        

        </div>
      </div>
    </div>

    
    {windowWidth <450 ? 
    <div className='w-[35px] h-[33px] rounded-md border-2 border-[#6B3710] bg-[#6B3710] absolute   m-1'>
      <img  src={'images/menu.png'} className=' object-fit w-full h-full p-1    sb-button '  onClick={() => {if (windowWidth > 640) {
      setCollapsed(!collapsed);
      
    } else {
      setToggled(!toggled);
      
    }
  }} alt="asd"/>
    </div>: null}
  </>
  )

}

export default Sidebari;