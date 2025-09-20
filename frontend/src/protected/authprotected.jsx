import { useContext, useEffect } from 'react';
import { UserContext } from '../contextapi/contextapi';
import { useNavigate } from 'react-router-dom';
import Preloader from '../pages/preloader';

const authprotected = ({Component}) => {
    
useContext
    const { data,loading,fetchUserInfo} = useContext(UserContext);

   
    const navigate = useNavigate();
 
    useEffect(() => {

     
        fetchUserInfo();
         
         if (data.message === 'Invalid user') {
              
              navigate('/login');
            }
     
      }, [data.message]);

      
      if(loading) return <Preloader/>
 
      return <Component />;
}

export default authprotected