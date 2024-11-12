import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Watermark from '../Watermark/Watermark';
import { UserContext } from '../../context/userContext';
import { ZAxis } from 'recharts';

function Sidebari({ content }) {
  const { role } = useContext(UserContext);
  console.log('Current user role from context:', role);

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

  return (
    <div className={`flex ${windowWidth > 640 ? 'max-w-[14rem]' : 'max-w-[8rem]'} bg-clip-border alt-color-bg`}>
      <div className='mb-8 justify-center self-center flex-col flex-wrap max-w-[14rem] w-full h-full align-center text-center py-4'>
        <div className='text-center self-center align-middle flex justify-center'>
          <img 
            src="img/logo_invsort.svg" 
            className="w-[50%] sm:w-[30%] mt-4 sb-button z-10" 
            onClick={() => {
              if (windowWidth > 640) {
                setCollapsed(!collapsed);
              } else {
                setToggled(!toggled);
              }
            }} 
            alt=""
          />
        </div>
        
        <div className="mt-[40px] w-full flex justify-center">
          <Sidebar 
            className='text-center m-auto' 
            onBackdropClick={() => setToggled(false)} 
            toggled={toggled} 
            breakPoint="all" 
          >
            <Menu menuItemStyles={{
                button: ({ level, active, disabled }) => {
                  if (level === 0) {
                    return {
                      color: 'rgb(255,195,118)',
                      [`&.active`]: {
                        backgroundColor: '#B45105',
                        color: '#b6c8d9',
                      },
                      [`&:hover`]: {
                        backgroundColor: '#3E1900'
                      }
                    };
                  }
                },
              }} className='mb-12'>
              <MenuItem className='MenuItem poppins-semibold' icon={<img id='carrinho' src="/images/grocery-store.png" />} component={<Link to="/products" />}>Produtos</MenuItem>
              <MenuItem className='MenuItem poppins-semibold' icon={<img id='chart' className='' src="/images/pie-chart.png" />} component={<Link to="/analytics" />}>Análise</MenuItem>
              <MenuItem className='MenuItem poppins-semibold' icon={<img id='chart' src="/images/arrows.png" />} component={<Link to="/stockmovements" />}>Movimentações</MenuItem>
            </Menu>
            <Watermark className="bottom-0" />
          </Sidebar>
          <Sidebar width='14rem' collapsed={!collapsed}>
            <Menu
              menuItemStyles={{
                button: ({ level, active, disabled }) => {
                  if (level === 0) {
                    return {
                      color: 'rgb(255,195,118)',
                      [`&.active`]: {
                        backgroundColor: '#B45105',
                        color: '#b6c8d9',
                      },
                      [`&:hover`]: {
                        backgroundColor: '#3E1900',
                      },
                    };
                  }
                },
              }}
              className='mb-12 w-full'
            >
              <MenuItem
                className='MenuItem poppins-semibold'
                title='Produtos'
                icon={<img id='carrinho' alt='produtos' src="/images/grocery-store.png" />}
                component={<Link to="/products" />}
              >
                Produtos
              </MenuItem>
              <MenuItem
                className='MenuItem poppins-semibold'
                title='Análise'
                icon={<img id='chart' className='' src="/images/pie-chart.png" />}
                component={<Link to="/analytics" />}
              >
                Análise
              </MenuItem>
              <MenuItem
                className='MenuItem poppins-semibold'
                title='Movimentações'
                icon={<img id='chart' src="/images/arrows.png" />}
                component={<Link to="/stockmovements" />}
              >
                Movimentações
              </MenuItem>
              {(role === 'admin' || role === 'gerente') && (
                
                  <SubMenu
                    icon={<img id='chart' src="/images/profile.png" />}
                    className="poppins-semibold" label="Gerenciar" style={{
                      textAlign:"center"
                    }}
                  >
                    <MenuItem
                      className='poppins-semibold'
                      component={<Link to="/userpage" />}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3E1900'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b3710'}
                      style={{
                        backgroundColor: '#6b3710',
                        color: 'rgb(255,195,118)',
                        margin: '0',
                        border: 'none',
                        padding: '10px',
                        transition: 'background-color 0.3s ease',
                        width: collapsed ? '40px' : '200px', 
                        height: '40px',
                      }}
                    >
                      {collapsed ? (
                        'Gerenciar Usuários'
                      ) : (
                        <img
                          id='user-icon'
                          src="/images/profile.png"
                          alt="gerenciar usuários"
                          style={{
                            width: '24px',
                            height: '24px',
                          }}
                        />
                      )}
                    </MenuItem>
                  </SubMenu>
              )}
            </Menu>
          </Sidebar>
        </div>
      </div>
    </div>
  );
}

export default Sidebari;