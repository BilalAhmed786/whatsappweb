import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contextapi/contextapi";
import { FaEllipsisH } from "react-icons/fa";
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
  const navigate = useNavigate();
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
    <div className="w-full h-screen">
      {/* Topbar */}
      <div className="relative flex items-center justify-between w-full h-[10vh] p-[15px] bg-gray-600">
        <div>
          <h2 className="font-sans font-medium text-lg text-white">Chats</h2>
        </div>
        <div className="flex justify-center items-center gap-3 relative">
          {data?.profilepicture ? (
            <img
              className="w-10 h-10 rounded-full"
              src={`${backendbaseurl}/images/${data?.profilepicture}`}
              alt="Profile"
            />
          ) : (
            <img className="w-12 h-12 rounded-full" src={Userpic} alt="User" />
          )}
          <FaEllipsisH
            className="mt-2 cursor-pointer text-white"
            onClick={() => {
              setDropdown((prev) => !prev);
              setCheckbox(false);
              setForwardmsgid([]);
              setReplymessage(false);
            }}
          />
          {dropdown && (
            <nav
              ref={dropdownRef}
              className="absolute w-32 z-50 py-1 bg-white top-10 right-0.5"
              onClick={() => setDropdown(false)}
            >
              <ul className="w-full cursor-pointer">
                <div onClick={() => setMyprofile(false)}>
                  <li className="mb-2 p-2 border-b-2 lightgray hover:bg-slate-100">
                    Profile
                  </li>
                </div>
                <div
                  onClick={() => {
                    setBlock(false);
                    setContacts(true);
                  }}
                >
                  <li className="mb-2 p-2 border-b-2 lightgray hover:bg-slate-100">
                    Contacts
                  </li>
                </div>
                <div
                  onClick={() => {
                    setBlock(true);
                    setContacts(false);
                  }}
                >
                  <li className="mb-2 p-2 border-b-2 lightgray hover:bg-slate-100">
                    Block Users
                  </li>
                </div>
                <div onClick={handleLogout}>
                  <li className="mb-2 p-2 border-b-2 lightgray hover:bg-slate-100">
                    Logout
                  </li>
                </div>
              </ul>
            </nav>
          )}
        </div>
      </div>

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
  );
};

export default Users;