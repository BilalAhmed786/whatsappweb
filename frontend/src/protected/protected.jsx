import React, { useContext, useEffect } from 'react';
import { UserContext } from '../contextapi/contextapi';
import { useNavigate } from 'react-router-dom';
import Preloader from '../pages/preloader';
const ProtectedUser = ({ Component }) => {
  const { data,loading,fetchUserInfo} = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {

    fetchUserInfo();
     
     if (data?.name) {
          
        
          navigate('/chat', { replace: true });
        
        }
    
  }, [data?.name]);

  
  if(loading) return <Preloader/>
  return <Component />;
};

export default ProtectedUser;
