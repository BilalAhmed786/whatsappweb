import React, { useContext, useEffect, useRef, useState } from 'react'
import { format } from "timeago.js";
import { UserContext } from '../contextapi/contextapi';
import axios from 'axios';
import { backendbaseurl } from '../baseurl/baseurl';
import Searchbar from './subutils/usercontacts/searchbar';
import Realtimemsgs from './subutils/usercontacts/realtimemsgs';
import Chatuserlist from './subutils/usercontacts/chatuserlist';
import Searchmessages from './subutils/usercontacts/searchmessages';
const usercontacts = ({


  initialLoad,
  setIndmsg,
  msgnlastmsg,
  updatemsgs,
  setReplymessage,
  setChatusers,
  chatusers,
  setShowUserList,
  setSearchmsgid,
  scrollToMessage



}) => {

  const { data, socket, setChatuserinfo, chatuserinfo } = useContext(UserContext); // Make sure this provides valid user data
  const [messages, setMessagedata] = useState([])
  const [lastmessage, setlastMessage] = useState([])
  const [lastmessagenotific, setlastMessagenotfic] = useState('')
  const [searchtext, setSearchtext] = useState('')
  const [chatId, setChatId] = useState('')
  const chatListRef = useRef(null); // Create a reference


  const notifymsg = async (msgid, user, chatId, loginuserId) => {


    try {


      const result = await axios.post(`${backendbaseurl}/api/chat/isViewed`, { msgid, chatId, loginuserId }, { withCredentials: true })


      if (result.data.msg) {


        socket.emit('isviewed', { isviewed: result.data.msg, sender: user._id, receiver: loginuserId, chatId: chatId })

      }


      setlastMessagenotfic(Date.now())
      setReplymessage(false)

    } catch (error) {



      console.log(error)
    }

    //loginuser and chatuser data store in database for notifications


    const res = await axios.post(`${backendbaseurl}/api/notification`, { loginuser: loginuserId, chatuser: user._id }, { withCredentials: true })

    try {


      socket?.emit('chatuser', { chatuser: res.data.chatuser, loginuser: res.data.loginuser })

    } catch (error) {

      console.log(error)
    }


    setChatuserinfo({  //chatuser info on click send to contextapi for all components
      userId: user._id,
      profilepic: user.profilepicture,
      name: user.name,
      status: user.status,
      about: user.about,
      blockedUsers: [...user.blockedUsers],
      blockedbyUsers: [...user.blockedbyUsers]
    });
    setShowUserList(false)
    setIndmsg(1)

  };

  //contacts scroll on top
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = 0; // Scroll to the top
    }
  }, [lastmessage])


  useEffect(() => {
    const userDet = async () => {
      try {

        const result = await axios.get(`${backendbaseurl}/api/users/userdet?userid=${data._id}&searchtext=${searchtext}`, { withCredentials: true })

        setChatusers(result.data?.users)
        setMessagedata(result.data?.messages)

      } catch (error) {
        console.log(error);
      }
    };

    // Ensure context data exists before calling userDet()
    if (data?._id) {

      userDet();

    }
  }, [data._id, searchtext]);


  // Dependency array includes 'data'

  useEffect(() => {

    const allchat = async (dataId) => {

      const chatmessages = await axios.get(`${backendbaseurl}/api/chat/messages/${dataId}`, { withCredentials: true })

      try {


        setlastMessage(chatmessages.data)
        setChatId(chatmessages.data[0]?.messages[0].chatId)

      } catch (error) {

        console.log(error)
      }

    }


    if (data._id) {

      allchat(data._id)
    }




  }, [data, lastmessagenotific, msgnlastmsg, updatemsgs])


  //socket working 
  Realtimemsgs(socket, data, setlastMessage, setChatusers)



  return (
    <>
      {/* Search Bar */}

      <Searchbar
        setSearchtext={setSearchtext}
        setReplymessage={setReplymessage}
        searchtext={searchtext}
      />

      <div
        className="custom-scrollbar cursor-pointer m-5 w-[95%] h-[73vh] overflow-auto"
        ref={chatListRef} // Attach reference here    
      >

        {/* Chat User List */}

        <Chatuserlist
          chatuserinfo={chatuserinfo}
          chatusers={chatusers}
          lastmessage={lastmessage}
          data={data}
          notifymsg={notifymsg}
          setIndmsg={setIndmsg}
          initialLoad={initialLoad}
          setSearchmsgid={setSearchmsgid}
         
         

        />

        {/* Messages List */}

        <Searchmessages
          messages={messages}
          chatusers={chatusers}
          data={data}
          notifymsg={notifymsg}
          chatId={chatId}
          setSearchmsgid={setSearchmsgid}

        />

        {/* No Contact or Chat Found */}
        {chatusers.length === 0 && messages.length === 0 && <p>No contact or chat found</p>}
      </div>
    </>

  )
}

export default usercontacts