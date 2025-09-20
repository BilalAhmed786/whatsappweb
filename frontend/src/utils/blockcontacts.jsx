import React, { useEffect, useState } from 'react';
import { FaSearch, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { backendbaseurl } from '../baseurl/baseurl';

const Blockcontacts = ({ fetchUserInfo,data,socket}) => {

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchblockuser, setSearchblockUser] = useState('');

  const unblockUser = async (blockUserId) => {
    try {
      const result = await axios.post(`${backendbaseurl}/api/users/unblock/${data._id}`, { blockUserId },{withCredentials:true});
     
      
        if(result.data){

         await fetchUserInfo();
         socket?.emit('blockuser',{user:result.data})

       
        }
      
    } catch (error) {
      console.log("Error unblocking user:", error);
    }
  };


  useEffect(() => {
    const blockuser = async () => {
      const result = await axios.get(`${backendbaseurl}/api/users/blockeduser?userid=${data._id}&searchuser=${searchblockuser}`,{withCredentials:true});

  
      try {
        setBlockedUsers(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (data._id) {
      blockuser();
    }
  }, [searchblockuser, blockedUsers]);


  return (
    <ul className="space-y-2">
      <div className="flex relative">
        <input
          className="w-full h-10 m-5 p-2 outline-0 border border-gray-300 rounded-xl"
          type="text"
          onChange={(e) => setSearchblockUser(e.target.value)}
          placeholder="Search Block Users..."
        />
        <span className="absolute right-7 top-7">
          <FaSearch size={24} color="gray" />
        </span>
      </div>
      {blockedUsers.length > 0 ? (
        blockedUsers.map((user, index) => (
          <li key={index} className="border-b border-gray-300 p-2">
            <div className="relative flex items-center">
              <img
                className="w-10 h-10 rounded-full"
                src={`${backendbaseurl}/images/${user.userId?.profilepicture}`}
                alt="Profile"
              />
              <span className="font-sans ml-4 font-normal text-sm">
                {user.userId?.name}
              </span>
              <span
                className="absolute right-2 cursor-pointer"
                onClick={() => unblockUser(user.userId._id)}
              >
                <FaLock />
              </span>
            </div>
          </li>
        ))
      ) : (
        <p className="ml-5">No blocked users found</p>
      )}
    </ul>
  );
};

export default Blockcontacts;
