import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { format } from "timeago.js";
import Userpic from '../images/user.jpg';
import { backendbaseurl } from '../baseurl/baseurl';

const ShowIndMsg = ({
  setIndmsg,
  stateSearch,
  setSearchmsgid,
  search,
  loginuser,
  chatuserinfo,
  data
}) => {
  const [messages, stateMessage] = useState('');

  const notifymsg = (msgid) => {
    setIndmsg(1);
    setSearchmsgid(msgid);
  };

  useEffect(() => {
    const usersmessages = async (chatuser, search) => {
      try {
        if (search) {
          const result = await axios.get(`${backendbaseurl}/api/chat/oneononesearch/${chatuser.userId}/${search}`, { withCredentials: true });
          stateMessage(result.data);
        } else {
          // clear results if search is empty
          stateMessage([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    usersmessages(chatuserinfo, search);
  }, [search]);

  return (
    <div className="custom-scrollbar h-screen overflow-y-auto overflow-x-hidden bg-slate-950 text-slate-200">
      {/* Close Icon and Title */}
      <div className="flex cursor-pointer w-full gap-4 mt-6 ml-5">
        <span onClick={() => setIndmsg(1)} className="text-slate-400 hover:text-white">
          <FaTimes />
        </span>
        <h5 className="ml-7 font-semibold text-slate-200">Search messages</h5>
      </div>

      {/* Input Container - Using flex to center the input */}
      <div className="flex justify-center mt-4">
        <input
          className="w-4/5 outline-none p-2 border border-slate-800 bg-slate-900 rounded text-slate-100 placeholder-slate-500 text-xs focus:border-indigo-500"
          type="text"
          value={search}
          onChange={(e) => stateSearch(e.target.value)}
          placeholder="Search Messages"
        />
      </div>
      <div>
        {messages.length > 0 ? (
          messages[0].messages.map((msg, index) => (
            <ul
              className="mt-2"
              onClick={() => notifymsg(msg._id)}
              key={index}
            >
              <li className="flex items-center gap-3 border-b border-slate-800 p-2 cursor-pointer hover:bg-slate-900/60 transition-colors">
                {msg.sender.profilepicture &&
                !data.blockedbyUsers.some((blckuser) => blckuser.userId === msg.sender._id) &&
                !data.blockedbyUsers.some((blckuser) => blckuser.userId === loginuser) ? (
                  <img className="w-10 h-10 rounded-full object-cover" src={`${msg.sender.profilepicture}`} alt="Profile" />
                ) : (
                  <img className="w-10 h-10 rounded-full object-cover" src={Userpic} alt="Default Profile" />
                )}
                <div className="flex w-full justify-between p-4">
                  <p className="w-[85%] break-all text-xs text-slate-300">{msg.text}</p>
                  <span className="text-xs text-slate-500">{format(msg.createdAt)}</span>
                </div>
              </li>
            </ul>
          ))
        ) : (
          <p className="text-center mt-5 text-slate-500 text-xs">no message to show</p>
        )}
      </div>
    </div>
  );
};

export default ShowIndMsg;