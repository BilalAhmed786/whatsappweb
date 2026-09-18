import React, { useEffect, useState } from 'react';
import { FaSearch, FaUnlock, FaBan, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Userpic from '../images/user.jpg';
import { backendbaseurl } from '../baseurl/baseurl';

const Blockcontacts = ({ fetchUserInfo, data, socket }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchblockuser, setSearchblockUser] = useState('');

  const unblockUser = async (blockUserId) => {
    try {
      const result = await axios.post(
        `${backendbaseurl}/api/users/unblock/${data._id}`,
        { blockUserId },
        { withCredentials: true }
      );

      if (result.data) {
        await fetchUserInfo();
        socket?.emit('blockuser', { user: result.data });
      }
    } catch (error) {
      console.log('Error unblocking user:', error);
    }
  };

  useEffect(() => {
    const blockuser = async () => {
      try {
        const result = await axios.get(
          `${backendbaseurl}/api/users/blockeduser?userid=${data._id}&searchuser=${searchblockuser}`,
          { withCredentials: true }
        );
        setBlockedUsers(result.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (data._id) {
      blockuser();
    }
  }, [data._id, searchblockuser, blockedUsers]);

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans">
      
      {/* Search Bar Container */}
      <div className="p-3 bg-slate-900/30 border-b border-slate-800/60">
        <div className="relative flex items-center w-full">
          <FaSearch className="absolute left-3.5 text-slate-500 text-xs pointer-events-none" />
          <input
            className="w-full pl-9 pr-8 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            type="text"
            value={searchblockuser}
            onChange={(e) => setSearchblockUser(e.target.value)}
            placeholder="Search Blocked Users..."
          />
          {searchblockuser && (
            <button
              onClick={() => setSearchblockUser('')}
              className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* Blocked Users List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user, index) => (
            <div
              key={user.userId?._id || index}
              className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 transition-all duration-200"
            >
              {/* Profile Image & Name */}
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  className="w-10 h-10 rounded-full object-cover border border-slate-700/60 flex-shrink-0"
                  src={
                    user.userId?.profilepicture
                      ? `${user.userId.profilepicture}`
                      : Userpic
                  }
                  alt={user.userId?.name || 'User'}
                />
                <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                  {user.userId?.name || 'Blocked User'}
                </span>
              </div>

              {/* Unblock Action Button */}
              <button
                onClick={() => unblockUser(user.userId?._id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-slate-700/60 text-slate-400 hover:text-emerald-400 text-xs font-medium transition-all duration-200 flex-shrink-0"
                title="Unblock User"
              >
                <FaUnlock className="text-[11px]" />
                <span>Unblock</span>
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
              <FaBan className="text-2xl" />
            </div>
            <p className="text-xs font-medium text-slate-400">
              No blocked users found
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Blockcontacts;