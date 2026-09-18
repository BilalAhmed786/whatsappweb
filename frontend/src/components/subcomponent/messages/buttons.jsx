import { useEffect, useRef } from "react";
import { FaSmile, FaChevronDown } from "react-icons/fa";

const buttons = ({msg, data, chatuserinfo, hoveredMessage, setDropdown, setSelectedMessage, setShowBlockNotification}) => {

  const handleEmojiPicker = (event, messageId, loginuser, chatuser) => {
    const userexist = loginuser.blockedUsers?.some((user) => user.userId == chatuser)

    if (userexist) {
      setShowBlockNotification({ reaction: 'reaction' })
      return;
    }

    setSelectedMessage(messageId);
  };

  const Msgdropdown = (id) => {
    setDropdown((prevState) => ({
      ...prevState, 
      [id]: !prevState[id], 
    }));
  };

  return (
    <div>
      {hoveredMessage === msg._id && (
        <div className={`absolute flex items-center ${msg.sender._id === data._id ? "-left-12 top-1" : "-right-12 top-1"} gap-1.5 p-1 rounded-full bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-md transition-all duration-200 z-30`}
        >
          {msg.media.length === 0 ||
            msg.media.some((file) => {
              const fileType = file.text?.split(".").pop().toLowerCase();
              return ["pdf", "doc", "docx", "webm"].includes(fileType);
            }) ? (
            <button
              onClick={(e) => handleEmojiPicker(e, msg._id, data, chatuserinfo.userId)}
              className="p-1 text-slate-400 hover:text-amber-400 transition-colors rounded-full hover:bg-slate-800/60"
            >
              <FaSmile className="text-sm" />
            </button>
          ) : null}
          
          <button
            onClick={() => Msgdropdown(msg._id)}
            className="p-1 text-slate-400 hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-800/60"
          >
            <FaChevronDown className="text-xs" />
          </button>
        </div>
      )}
    </div>
  )
}

export default buttons