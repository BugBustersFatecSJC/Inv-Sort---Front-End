import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import UserProfileIcon from '../../components/UserProfileIcon/UserProfileIcon';
import Loading from '../../components/Loading/Loading';
import CategoryButtons from '../../components/CategoryButtons/CategoryButtons';
import Mainchart from '../../components/MainChart/Mainchart';
import Sectorchart from '../../components/Sectorchart/Sectorchart';
import Cardsanalytics from '../../components/Cardsanlaytics/Cardsanalytics';
import MainPage from '../MainPage/MainPage';

function Analytics(props) {
  // const [loading, setloading] = useState(false);
  // const loadingIcon = () => {
  //   setloading((prevLoading) => !prevLoading);
  // };

  return (
    <MainPage title="Analytics"> {/* Certifique-se de que todas as tags JSX estão bem fechadas */}
      <div className='main-color-bg h-[100%] flex'>
        <Sidebar />
        <div id='main' className='w-[100%] min-h-[100vh] px-12 h-[100%] grid-col-2 flex overflow-scroll overflow-x-hidden flex-wrap flex-col text-center justify-start items-center'>
          <div className='flex flex-col w-full items-end justify-start p-4'>
            <UserProfileIcon />
          </div>
          <Cardsanalytics />

          <div className='w-[100%] h-[100%] mt-12 grid grid-cols-3 gap-6'>
            <div className='col-span-2 flex flex-col h-[100%] px-2 py-2 flex justify-center border-4 rounded border-[#B45105] bg-[#FFC376]'>
              <Mainchart />
            </div>

            <div className='h-[100%] col-span-1 px-2 py-2 flex flex-col items-center self-center w-[100%] border-4 rounded border-[#B45105] bg-[#FFC376]'>
              <h1 className='poppins-semibold'>Vendas por Categorias</h1>
              <Sectorchart />
            </div>
          </div>
        </div>
      </div>
    </MainPage>
  );
}

export default Analytics;
