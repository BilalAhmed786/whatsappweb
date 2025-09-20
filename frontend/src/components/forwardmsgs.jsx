import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { UserContext } from "../contextapi/contextapi";
import axios from "axios";
import { backendbaseurl } from "../baseurl/baseurl";
const ForwardMessage = (
  {
    setDisplayusers,
    forwardmsgids,
    setCheckbox,
    setForwardmsgid,
    forwardmsgobjid,
    setUpdatemsgs,
    initialLoad,
    chater
  }
) => {

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, searchText] = useState('')
  const [users, setusers] = useState([]);
  const [update, setUpdate] = useState('')
  const { data, socket, chatuserinfo } = useContext(UserContext)





  useEffect(() => {

    const datauser = async () => {

      const users = await axios.get(`${backendbaseurl}/api/users/userfwdmsg?loginuser=${data._id}&chatuser=${chatuserinfo.userId}&search=${search}`, { withCredentials: true })

      try {

        if (data._id) {

          setusers(users.data)

        }


      } catch (error) {

        console.log(error)
      }


    }

    datauser()

  }, [search])


  //for track chatusers which users is currently open login user
  useEffect(() => {
    setSelectedUsers((prev) => {
      return prev.map((user) => {
        const hasMatch = chater.some(
          (existUser) => existUser.chatuser.toString() === user.loginuser.toString() && existUser.loginuser.toString() === user.chatuser.toString()
        );

        // Update isviewed to true if a match is found
        return hasMatch ? { ...user, isviewed: true } : user;
      });
    });
  }, [chater, update]);


  const handleCheckboxChange = (user, loginid) => {
    
    setSelectedUsers((prev) => {
      
      const exists = prev.some(duser => duser.chatuser === user._id);

      if (exists) {
      
        return prev.filter(duser => !(duser.chatuser === user._id));
      } else {

        const isBlocked = user.blockedUsers.some(blockedUser => blockedUser.userId === loginid);

        
        return [
          ...prev,
          {
            chatuser: user._id,
            loginuser: loginid,
            isviewed: false,
            isblocked: isBlocked
          }
        ];
      }
    });


    setUpdate(Date.now())
  };


  const handleSend = async (forwardmsgids, forwardmsgobjid, selectedUsers) => {


    try {
      let result;

      if (!forwardmsgobjid) {
        // Forwarding multiple messages
        result = await axios.post(`${backendbaseurl}/api/chat/forwardmessage`, {
          forwardmsgids,
          selectedUsers
        }, {
          withCredentials: true
        });

        if (result.data) {

          const lastmsg = result.data

          socket.emit('forwardmessages', lastmsg)
        }

      } else {
        // Forwarding a single media file
        result = await axios.post(`${backendbaseurl}/api/chat/singlemediafwd`, {
          forwardmsgids,
          forwardmsgobjid,
          selectedUsers


        }, { withCredentials: true });

        if (result.data) {

          const lastmsg = result.data

          socket?.emit('singlefwdchat', lastmsg)

          //scroll to bottom
          initialLoad.current = true

        }
      }

      // Handle success response
      if (result.data) {

        setDisplayusers(false);
        setForwardmsgid('');
        setCheckbox(false);
        setUpdatemsgs(Date.now())

      }
    } catch (error) {
      // Handle any errors
      console.error('Error forwarding message:', error);
    }
  };


  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
   
      <div className="bg-white w-96 rounded-lg shadow-lg relative">
     
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h3 className="text-lg font-semibold">Forward message to</h3>
          <button
            onClick={() => {
              setDisplayusers(false)
              setForwardmsgid('');

            }}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => searchText(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Chat List */}
        <div className="max-h-64 overflow-y-auto px-4">
          {users.length > 0 && users.map((user, index) => (
            <div
              key={index}
              className="flex items-center py-2 border-b hover:bg-gray-100"
            >
              <input
                type="checkbox"
                className="mr-3"
                checked={selectedUsers.some(slect => slect.chatuser === user._id)}
                onChange={() => handleCheckboxChange(user, data._id)}
              />
              <div>
                <h4 className="font-medium p-2">{user.name}</h4>

              </div>
            </div>
          ))}
        </div>

        {/* Send Button */}
        {selectedUsers.length > 0 && (
          <div className="p-4 border-t flex justify-end">
            <button
              onClick={() => handleSend(forwardmsgids, forwardmsgobjid, selectedUsers)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ForwardMessage;
