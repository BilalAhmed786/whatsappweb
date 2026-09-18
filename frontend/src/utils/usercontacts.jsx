import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../contextapi/contextapi';
import axios from 'axios';
import { backendbaseurl } from '../baseurl/baseurl';
import Searchbar from './subutils/usercontacts/searchbar';
import Realtimemsgs from './subutils/usercontacts/realtimemsgs';
import Chatuserlist from './subutils/usercontacts/chatuserlist';
import Searchmessages from './subutils/usercontacts/searchmessages';
import { FaUserFriends } from 'react-icons/fa';

const Usercontacts = ({
  initialLoad,
  setIndmsg,
  msgnlastmsg,
  updatemsgs,
  setReplymessage,
  setChatusers,
  chatusers,
  setShowUserList,
  setSearchmsgid,
}) => {
  const { data, socket, setChatuserinfo, chatuserinfo } = useContext(UserContext);
  const [messages, setMessagedata] = useState([]);
  const [lastmessage, setlastMessage] = useState([]);
  const [lastmessagenotific, setlastMessagenotfic] = useState('');
  const [searchtext, setSearchtext] = useState('');
  const [chatId, setChatId] = useState('');
  const chatListRef = useRef(null);

  const notifymsg = async (msgid, user, chatId, loginuserId) => {
    try {
      const result = await axios.post(
        `${backendbaseurl}/api/chat/isViewed`,
        { msgid, chatId, loginuserId },
        { withCredentials: true }
      );

      if (result.data.msg) {
        socket.emit('isviewed', { isviewed: result.data.msg, sender: user._id, receiver: loginuserId, chatId: chatId });
      }

      setlastMessagenotfic(Date.now());
      setReplymessage(false);
    } catch (error) {
      console.log(error);
    }

    const res = await axios.post(
      `${backendbaseurl}/api/notification`,
      { loginuser: loginuserId, chatuser: user._id },
      { withCredentials: true }
    );

    try {
      socket?.emit('chatuser', { chatuser: res.data.chatuser, loginuser: res.data.loginuser });
    } catch (error) {
      console.log(error);
    }

    setChatuserinfo({
      userId: user._id,
      profilepic: user.profilepicture,
      name: user.name,
      status: user.status,
      about: user.about,
      blockedUsers: [...user.blockedUsers],
      blockedbyUsers: [...user.blockedbyUsers]
    });
    setShowUserList(false);
    setIndmsg(1);
  };

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = 0;
    }
  }, [lastmessage]);

  useEffect(() => {
    const userDet = async () => {
      try {
        const result = await axios.get(
          `${backendbaseurl}/api/users/userdet?userid=${data._id}&searchtext=${searchtext}`,
          { withCredentials: true }
        );

        setChatusers(result.data?.users);
        setMessagedata(result.data?.messages);
      } catch (error) {
        console.log(error);
      }
    };

    if (data?._id) {
      userDet();
    }
  }, [data._id, searchtext]);

  useEffect(() => {
    const allchat = async (dataId) => {
      try {
        const chatmessages = await axios.get(`${backendbaseurl}/api/chat/messages/${dataId}`, { withCredentials: true });
        setlastMessage(chatmessages.data);
        setChatId(chatmessages.data[0]?.messages[0].chatId);
      } catch (error) {
        console.log(error);
      }
    };

    if (data._id) {
      allchat(data._id);
    }
  }, [data, lastmessagenotific, msgnlastmsg, updatemsgs]);

  Realtimemsgs(socket, data, setlastMessage, setChatusers);

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Search Bar */}
      <Searchbar
        setSearchtext={setSearchtext}
        setReplymessage={setReplymessage}
        searchtext={searchtext}
      />

      {/* Chat List Box */}
      <div
        className="custom-scrollbar flex-1 overflow-y-auto px-3 py-2 space-y-1"
        ref={chatListRef}
      >
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

        <Searchmessages
          messages={messages}
          chatusers={chatusers}
          data={data}
          notifymsg={notifymsg}
          chatId={chatId}
          setSearchmsgid={setSearchmsgid}
        />

        {/* Empty State */}
        {chatusers.length === 0 && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
              <FaUserFriends className="text-2xl" />
            </div>
            <p className="text-xs text-slate-400 font-medium">No contacts or chats found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Usercontacts;