import {useState,useEffect} from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import UserProfileIcon from '../../components/UserProfileIcon/UserProfileIcon';
import Cardsanalytics from '../../components/Cardsanlaytics/Cardsanalytics';
import Mainchart from '../../components/MainChart/Mainchart';
import Sectorchart from '../../components/Sectorchart/Sectorchart'
import api from '../../services/api';

function Analytics() {
  const [loading, setloading] = useState(false);
  const [cards, setCards] = useState([])
  

  const loadingIcon = () => {
    setloading((prevLoading) => !prevLoading);
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  })
 
  useEffect(() => {
      const fetchCards = async () => {
          try {
              const response = await api.get('/cards')
              setCards(response.data)
          } catch (err) {
              console.error("Error fetching cards:", err);
          }
      }

      fetchCards()
  }, [])
  if (cards.length === 0) {
    return <div>Loading...</div>;
  }
  
  console.log(cards);
  
  return (
    <div className='main-color-bg h-[100%] flex'>
      
      <Sidebar />
     
      <div id='main' className='w-[100%] min-h-[100vh] px-4 h-[100%] grid-col-2 flex overflow-scroll overflow-x-hidden flex-wrap flex-col  text-center justify-start items-center'>

        <div className='flex flex-col w-full items-end justify-start p-4'>
        <UserProfileIcon/>

        </div>
        
        <div className='flex flex-col h-[400px] py-2 w-full flex-wrap  justify-center border-4   border-[rgb(180,81,5)] outline outline-4 outline-[rgb(107,55,16)] bg-[#FFC376] '>
        <Mainchart />
        </div>
        <div className={` w-full h-[420px] justify-evenly   mt-8 mb-4 ${windowWidth<980 ? "block   ":"flex " }`}>
        <div className={` flex  flex-col  ${windowWidth<980 ? "w-full  ":"w-1/2 mr-4"}   py-2  h-full flex border-4   border-[rgb(180,81,5)] outline outline-4 outline-[rgb(107,55,16)] bg-[#FFC376]`}>
        <Sectorchart />
         
        </div>

        <div className={`h-[100%]  ${windowWidth<980 ? "w-full my-4":"w-1/2 ml-4 "}   py-2 px-2 flex flex-col justify-between border-4  border-[rgb(180,81,5)] outline outline-4 outline-[rgb(107,55,16)] bg-[#FFC376]`}>
          
        <Cardsanalytics text={'Produto de maior faturamento'} label={`${cards[0].product_name}`} data={cards[0].faturamento} />
        <Cardsanalytics text={'Categoria de maior faturamento'} label={`${cards[1].category_name}`} data={cards[1].faturamento}  />
        <Cardsanalytics text={'Produto com mais vendas'} label={`${cards[2].category_name}`} data={cards[2].vendas} sufix=' Un.'  />
        <Cardsanalytics text={'Categoria com mais vendas'} label={`${cards[3].product_name}`} data={cards[3].vendas} sufix=' Un.'  />
        <p className='poppins-bold text-[10px] text-start'>Dados em relação ao mês anterior</p>
        </div>
      </div>
      
            </div>
      </div>
    
  );
}

export default Analytics;
