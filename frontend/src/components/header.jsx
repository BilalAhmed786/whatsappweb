import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaSearch, FaArrowLeft, FaEllipsisV, FaUser, FaTrashAlt, FaBroom } from 'react-icons/fa';
import { UserContext } from '../contextapi/contextapi';
import Userpic from '../images/user.jpg';
import { backendbaseurl } from '../baseurl/baseurl';

const Header = ({ 
  setIndmsg,
  setShowUserList,
  setdeleteCheckbox,
  setChatclear, 
  setCheckbox,
  stateSearch,
  setForwardmsgid,
  setReplymessage,
  socket
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const { data, notific, chatuserinfo } = useContext(UserContext);
  const [messagecount, setMsgcount] = useState([]);

  const totalcount = messagecount?.map((item) => item?.count || 0).reduce((a, b) => a + b, 0);

  const handleChatuser = () => {
    socket.emit('chatuser', { chatuser: 12345, loginuser: data._id });
    setShowUserList(true);
  };

  useEffect(() => {
    setMsgcount(notific);
  }, [notific]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    if (isDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownVisible]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    setCheckbox(false);
    setReplymessage(false);
    setForwardmsgid([]);
  };

  const isUserOnline = 
    !data.blockedUsers?.some((user) => user.userId === chatuserinfo.userId) &&
    !data.blockedbyUsers?.some((user) => user.userId === chatuserinfo.userId) &&
    chatuserinfo.status === 1;

  const isUserBlocked = data.blockedbyUsers?.some((duser) => duser.userId === chatuserinfo.userId);

  return (
    <div className="relative flex items-center justify-between w-full h-[10vh] min-h-[70px] px-4 py-2 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md z-30">
      
      {/* Left Section: Back Button (Mobile) & User Info */}
      <div className="flex items-center space-x-3">
        {/* Mobile Back Button */}
        <div className="relative flex lg:hidden">
          <button
            onClick={handleChatuser}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Back to chat list"
          >
            <FaArrowLeft className="text-lg" />
          </button>

          {/* Unread Message Badge */}
          {totalcount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50">
              {totalcount}
            </span>
          )}
        </div>

        {/* User Avatar with Status Indicator */}
        <div className="relative flex-shrink-0 cursor-pointer" onClick={() => setIndmsg(3)}>
          <img
            className="w-11 h-11 rounded-full object-cover border-2 border-slate-700/80 shadow-md transition-transform hover:scale-105"
            src={
              chatuserinfo.profilepic && !isUserBlocked
                ? `${chatuserinfo.profilepic}`
                : Userpic
            }
            alt={chatuserinfo.name || 'User Profile'}
          />

          {/* Online Dot */}
          {isUserOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
            </span>
          )}
        </div>

        {/* User Name & Subtitle */}
        <div className="flex flex-col cursor-pointer" onClick={() => setIndmsg(3)}>
          <h3 className="font-semibold text-slate-100 text-base leading-tight hover:text-indigo-400 transition-colors line-clamp-1">
            {chatuserinfo.name || 'User'}
          </h3>
          <span className="text-xs text-slate-400 mt-0.5 font-medium">
            {isUserOnline ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
              </span>
            ) : (
              'Offline'
            )}
          </span>
        </div>
      </div>

      {/* Right Section: Header Actions */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Search Action */}
        <button
          onClick={() => {
            setIndmsg(2);
            setReplymessage(false);
            stateSearch('');
          }}
          className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all duration-200 focus:outline-none"
          title="Search Messages"
        >
          <FaSearch className="text-base" />
        </button>

        {/* Dropdown Toggle */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all duration-200 focus:outline-none"
            title="More Options"
          >
            <FaEllipsisV className="text-base" />
          </button>

          {/* Animated Glassmorphism Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-200 origin-top-right z-50 ${
              isDropdownVisible
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}
          >
            <ul className="py-1.5 text-sm text-slate-300">
              <li>
                <button
                  className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
                  onClick={() => {
                    setIndmsg(3);
                    setdeleteCheckbox(false);
                    setChatclear(false);
                    setIsDropdownVisible(false);
                  }}
                >
                  <FaUser className="text-indigo-400 text-xs" />
                  <span>View Profile</span>
                </button>
              </li>

              <li>
                <button
                  className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
                  onClick={() => {
                    setChatclear(true);
                    setdeleteCheckbox(false);
                    setIsDropdownVisible(false);
                  }}
                >
                  <FaBroom className="text-amber-400 text-xs" />
                  <span>Clear Chat</span>
                </button>
              </li>

              <li className="border-t border-slate-800/80 my-1"></li>

              <li>
                <button
                  className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-rose-500/10 hover:text-rose-400 text-rose-400/90 transition-colors text-left"
                  onClick={() => {
                    setdeleteCheckbox(true);
                    setChatclear(false);
                    setIsDropdownVisible(false);
                  }}
                >
                  <FaTrashAlt className="text-xs" />
                  <span>Remove Message</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Header;