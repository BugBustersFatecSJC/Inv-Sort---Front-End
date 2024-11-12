import { useContext, useState } from 'react';
import Sidebari from '../../components/Sidebar/Sidebar';
import UserProfileIcon from '../../components/UserProfileIcon/UserProfileIcon';
import CategoryButtons from '../../components/CategoryButtons/CategoryButtons';
import Loading from '../../components/Loading/Loading';
import { UserContext } from '../../context/userContext'; 

function MainPage(props) {
  const [loading, setLoading] = useState(false);
  const { role } = useContext(UserContext);

  const toggleLoading = () => {
    setLoading((prevLoading) => !prevLoading);
  };

  
  return (
    <div className='flex main-color-bg min-h-[105vh]  '>
      
      <Sidebari />

      <div className='w-[100%]  flex flex-col items-center '>
      

        <div className='flex flex-col w-full items-end justify-start p-4'>
          <UserProfileIcon />
        </div>
        <div className='w-[100%] mx-auto flex flex-col'>
          <div className='w-full flex justify-start'>

            <h1 className='text-xl md:text-2xg lg:text-4xg px-4 poppins-semibold'>{props.title}</h1>
          </div>



          </div>
          <main className='w-full p-4'>
            {props.children}
          </main>
        </div>
      </div>
    
  );
}

export default MainPage;
