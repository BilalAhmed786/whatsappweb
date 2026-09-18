import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contextapi/contextapi";
import { FaEllipsisV, FaUser, FaAddressBook, FaBan, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Usercontacts from "../utils/usercontacts";
import Blockcontacts from "../utils/blockcontacts";
import Userpic from "../images/user.jpg";
import axios from "axios";
import { backendbaseurl, frontendbaseurl } from "../baseurl/baseurl";

const Users = ({
  setMyprofile,
  setSearchmsgid,
  initialLoad,
  setIndmsg,
  setCheckbox,
  setForwardmsgid,
  msgnlastmsg,
  updatemsgs,
  setReplymessage,
  messages,
  messageRefs,
  setShowUserList,
  lastmessageupdate,
  scrollToMessage,
}) => {
  const { fetchUserInfo, data, socket } = useContext(UserContext);
  const [dropdown, setDropdown] = useState(false);
  const [toggleblock, setBlock] = useState(false);
  const [togglecontact, setContacts] = useState(true);
  const [chatusers, setChatusers] = useState([]);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      if (socket) {
        socket.disconnect();
      }

      // Step 2: Send logout request to backend
      const result = await axios.post(
        `${backendbaseurl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (result.data) {
        window.location.href = `${frontendbaseurl}/login`;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Socket working
  useEffect(() => {
    const handleUser = (data) => {
      setChatusers((prevdata) => {
        const exists = prevdata.some((user) => user._id === data._id);
        if (exists) {
          return prevdata
            .map((user) => (user._id === data._id ? data : user))
            .sort((a, b) => b.status - a.status);
        } else {
          return [...prevdata, data].sort((a, b) => b.status - a.status);
        }
      });
    };

    const handleBlockuser = (data) => {
      setChatusers((prev) => {
        return prev?.map((user) => {
          if (user._id === data._id) {
            return {
              ...user,
              blockedUsers: [...data.blockedUsers],
            };
          }
          return user;
        });
      });
    };

    socket?.on("user", handleUser);
    socket?.on("blockuser", handleBlockuser);

    // Cleanup listeners only (Do NOT disconnect socket here)
    return () => {
      socket?.off("user", handleUser);
      socket?.off("blockuser", handleBlockuser);
    };
  }, [socket]);

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex flex-col border-r border-slate-800/80 font-sans">
      
      {/* Top Bar Header */}
      <div className="relative flex items-center justify-between w-full h-[10vh] min-h-[70px] px-4 py-2 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 z-30">
        <div className="flex items-center space-x-3">
          <h2 className="font-bold text-lg text-white tracking-tight">Chats</h2>
        </div>

        {/* Profile Avatar & Options Toggle */}
        <div className="flex items-center space-x-2">
          <div 
            className="cursor-pointer"
            onClick={() => setMyprofile(false)}
            title="View Profile"
          >
            {data?.profilepicture ? (
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-700/80 shadow-md transition-transform hover:scale-105"
                src={`${data?.profilepicture}`}
                alt="Profile"
              />
            ) : (
              <img 
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-700/80 shadow-md transition-transform hover:scale-105" 
                src={Userpic} 
                alt="User" 
              />
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setDropdown((prev) => !prev);
                setCheckbox(false);
                setForwardmsgid([]);
                setReplymessage(false);
              }}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all duration-200 focus:outline-none"
              title="More Options"
            >
              <FaEllipsisV className="text-base" />
            </button>

            {/* Dropdown Menu */}
            {dropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden z-50 transform transition-all duration-200">
                <ul className="py-1.5 text-sm text-slate-300">
                  <li>
                    <button
                      className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
                      onClick={() => {
                        setMyprofile(false);
                        setDropdown(false);
                      }}
                    >
                      <FaUser className="text-indigo-400 text-xs" />
                      <span>My Profile</span>
                    </button>
                  </li>

                  <li>
                    <button
                      className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
                      onClick={() => {
                        setBlock(false);
                        setContacts(true);
                        setDropdown(false);
                      }}
                    >
                      <FaAddressBook className="text-emerald-400 text-xs" />
                      <span>Contacts</span>
                    </button>
                  </li>

                  <li>
                    <button
                      className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
                      onClick={() => {
                        setBlock(true);
                        setContacts(false);
                        setDropdown(false);
                      }}
                    >
                      <FaBan className="text-amber-400 text-xs" />
                      <span>Blocked Users</span>
                    </button>
                  </li>

                  <li className="border-t border-slate-800/80 my-1"></li>

                  <li>
                    <button
                      className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-rose-500/10 hover:text-rose-400 text-rose-400/90 transition-colors text-left"
                      onClick={() => {
                        setDropdown(false);
                        handleLogout();
                      }}
                    >
                      <FaSignOutAlt className="text-xs" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Child View Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {togglecontact && (
          <Usercontacts
            initialLoad={initialLoad}
            setIndmsg={setIndmsg}
            msgnlastmsg={msgnlastmsg}
            updatemsgs={updatemsgs}
            setReplymessage={setReplymessage}
            setChatusers={setChatusers}
            chatusers={chatusers}
            messages={messages}
            messageRefs={messageRefs}
            setShowUserList={setShowUserList}
            lastmessageupdate={lastmessageupdate}
            setSearchmsgid={setSearchmsgid}
            scrollToMessage={scrollToMessage}
          />
        )}
        {toggleblock && (
          <Blockcontacts
            data={data}
            fetchUserInfo={fetchUserInfo}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
};

export default Users;