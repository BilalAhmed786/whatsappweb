import { useEffect, useRef } from "react";
import { FaSmile,FaChevronDown } from "react-icons/fa";

const buttons = ({msg,data,chatuserinfo,hoveredMessage,setDropdown,setSelectedMessage,setShowBlockNotification}) => {


const handleEmojiPicker = (event, messageId, loginuser, chatuser) => {


    const userexist = loginuser.blockedUsers?.some((user) => user.userId == chatuser)


    if (userexist) {


      setShowBlockNotification({ reaction: 'reaction' })

      return;
    }


    setSelectedMessage(messageId,);



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
                <div className={`absolute flex ${msg.sender._id === data._id ? "left-3 top-1" : "right-1 top-1"} gap-3`}
                >

                    {msg.media.length === 0 ||
                        msg.media.some((file) => {
                            const fileType = file.text?.split(".").pop().toLowerCase();
                            return ["pdf", "doc", "docx", "webm"].includes(fileType);
                        }) ? (
                        <button
                            onClick={(e) => handleEmojiPicker(e, msg._id, data, chatuserinfo.userId)}
                            className={`${msg.sender._id !== data._id ? 'text-gray-500' : 'text-white'} hover:text-blue-700`}
                        >
                            <FaSmile />
                        </button>
                    ) : null}
                    <FaChevronDown
                        className={`${msg.sender._id !== data._id ? 'text-gray-500' : 'text-white'} hover:text-blue-700`}
                        onClick={() => Msgdropdown(msg._id)}
                    />

                </div>
            )}

        </div>
    )
}

export default buttons