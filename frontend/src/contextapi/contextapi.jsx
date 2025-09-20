// Contextapi.js
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { backendbaseurl } from '../baseurl/baseurl';
const socket = io(backendbaseurl,{autoConnect:false});
export const UserContext = createContext();


const Contextapi = ({ children }) => {

    const [data, setUserData] = useState('');
    // const [socket, setSocket] = useState(null);
    const [chatuserinfo, setChatuserinfo] = useState('')
    const [loading, setLoading] = useState(true); 
    const [notific, setNotific] = useState([]);


    const fetchUserInfo = async () => {

        //  setLoading(true)
      
         try {
            const result = await axios.get(`${backendbaseurl}/api/auth/userinfo`,{withCredentials:true});

            setUserData(result.data);

            socket?.emit('userId', result.data._id);  // Emit userId after fetching user info

        } catch (error) {

            
            setUserData(error.response.data)
            console.error("Error fetching user data:", error);
        }finally {
               setLoading(false); 

          
        }
    };


    useEffect(() => {


        if (!socket) return;

        const handleUser = (data) => {

            setChatuserinfo((prevdata) => {
                if (prevdata?.userId === data?._id ) {
                    return {
                        ...prevdata,
                        userId: data._id,
                        profilepic: data.profilepicture,
                        name: data.name,
                        status: data.status,
                        about: data.about,
                        blockedUsers:[...data.blockedUsers],
                        blockedbyUsers:[...data.blockedbyUsers] 
                       
                       
                    };
                } else {
                    return prevdata; // Fallback to an empty object if no match
                }
            });
        };


        const handleBlockuser = (res) => {

          
            // Only update `data` if the logged-in user is the one who blocked someone
            setUserData((prev) => {
                if (prev?._id === res?._id) {
                    return {
                        ...prev,
                        blockedUsers: [...res.blockedUsers], // Update blocked users
                        blockedbyUsers:[...res.blockedbyUsers] // Update blocked users
                    };
                }
                return prev;
            });
        };
        
        
        socket?.on("user", handleUser);
        socket?.on('blockuser', handleBlockuser);


        return () => {
        
        socket?.off('user', handleUser);
        socket?.off('blockuser', handleBlockuser);

        };

    }, [socket,data])

    return (
        <UserContext.Provider
            value={{
                data,
                socket,
                chatuserinfo,
                loading,
                notific,
                setChatuserinfo,
                fetchUserInfo,
                setNotific
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default Contextapi
