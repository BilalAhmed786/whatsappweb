import axios from "axios";
import React, { useState, useEffect, useCallback, useContext } from "react";
import ReactDOM from "react-dom";
import { FaDownload, FaShare, FaReply, FaTrash } from "react-icons/fa";
import { UserContext } from "../contextapi/contextapi";
import { backendbaseurl } from "../baseurl/baseurl";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

const MediaViewer = ({
  mediaFiles,
  textareaRef,
  setReplymessage,
  setForwardmsgobjid,
  setDisplayusers,
  setUpdatemsgs,
  setForwardmsgid,
  onClose,
  userExists,
  setShowBlockNotification

}) => {


  // Filter out document files
  const filteredMediaFiles = mediaFiles.mediaFiles.filter((file) => {
    const fileType = file.text.split(".").pop().toLowerCase();
    return !["pdf", "doc", "docx", "webm"].includes(fileType);
  });

  const { data,socket,chatuserinfo } = useContext(UserContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reactions, setReactions] = useState({});

  //reply media message



  const replyHandler = (msg) => {

    textareaRef.current.focus()
    setReplymessage(msg)
    onClose()

  }

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredMediaFiles.length);
  }, [filteredMediaFiles.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredMediaFiles.length) % filteredMediaFiles.length);
  }, [filteredMediaFiles.length]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === "ArrowLeft") {
        goToPrev();
      } else if (event.key === "Escape") {
        onClose();
      }
    },
    [goToNext, goToPrev, onClose]
  );

  const downloadMedia = () => {
    const fileName = filteredMediaFiles[currentIndex].text;
    const link = document.createElement("a");
    link.href = `${backendbaseurl}/files/download/${fileName}`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isVideo = (fileName) => {
    const videoExtensions = ["mp4", "avi", "mov"];
    return videoExtensions.includes(fileName.text.split(".").pop().toLowerCase());
  };

  // Handle emoji reaction
  const handleReaction = async (emoji, objectId, msgId, userId,chatuserid,isviewed) => {

    if(data.blockedUsers.some((user)=>user.userId === chatuserid)){

      setShowBlockNotification({reaction:'reaction'})
     
      return
    }

    setReactions((prevState) => ({
      ...prevState,
      [currentIndex]: emoji,
    }));

    try {
      const result = await axios.post(`${backendbaseurl}/api/chat/mediareaction/${msgId}`, { emoji, objectId, userId,chatuserid,isviewed},{withCredentials:true});
    
      setUpdatemsgs(Date.now())
      socket?.emit('mediareaction',{msg:result.data,senderid:userId,receiverid:chatuserid})
      
    } catch (error) {
      console.log(error);
    }
  };

  // Handle delete media
  const handleDelete = async (msgId, objectId, userId) => {
    try {

      await axios.post(`${backendbaseurl}/api/chat/deletesingleMedia/${msgId}`, { objectId, userId },{withCredentials:true});

    } catch (error) {

      console.log("Error deleting media:", error);

    }
  };

  //handle forward message


  const onForward = (msgId, objectId) => {

    setDisplayusers(true)
    setForwardmsgid(msgId)
    setForwardmsgobjid(objectId)

  }


  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (filteredMediaFiles.length === 0) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white bg-gray-800 px-3 py-2 rounded-md z-50"
      >
        Close
      </button>

      {/* User Profile */}
      <div className="absolute top-5 left-5 flex items-center gap-2">
        {mediaFiles.sender?.profilepicture ? (
          <img
            src={`${backendbaseurl}/images/${mediaFiles.sender?.profilepicture}`}
            alt="User Profile"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <span className="absolute w-36 left-0 z-50 text-white">{mediaFiles.sender?.name}</span>
        )}
      </div>

      {/* Media Carousel */}
      <div className="w-full h-full flex flex-col justify-center items-center relative">
        {isVideo(filteredMediaFiles[currentIndex]) ? (
          <video
            src={`${backendbaseurl}/videos/${filteredMediaFiles[currentIndex].text}`}
            controls
            className="max-w-full h-[95%] object-contain"
          />
        ) : (
          <img
            src={`${backendbaseurl}/images/${filteredMediaFiles[currentIndex].text}`}
            alt={`media-${currentIndex}`}
            className="w-full h-[95%] object-contain"
          />
        )}

        {/* Navigation Buttons */}
        {filteredMediaFiles.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full"
            >
              &#8592;
            </button>
            <button
              onClick={goToNext}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full"
            >
              &#8594;
            </button>
          </>
        )}

        {/* Reaction, Download, Delete, and Forward Buttons */}
        {mediaFiles.msgId ?
          <>
            <div className="absolute top-20 left-2 flex flex-wrap gap-5">
              {/* Download Button with Tooltip */}

              <div className="relative group">
                <button onClick={downloadMedia} className="text-white bg-black rounded-full p-2 hover:bg-gray-800">
                  <FaDownload />
                </button>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
                  Download
                </span>
              </div>


              {/* Reply Button with Tooltip */}
              <div className="relative group">
                <button
                  className="text-white bg-black rounded-full p-2 hover:bg-gray-800"
                  onClick={() =>
                    replyHandler({
                      objectId: filteredMediaFiles[currentIndex]._id,
                      repliedtomsgId: mediaFiles.msgId,
                      repliedmsg: filteredMediaFiles[currentIndex].text,
                    })
                  }
                >
                  <FaReply />
                </button>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
                  Reply
                </span>
              </div>

              {/* Forward Button with Tooltip */}
              <div className="relative group">
                <button onClick={() => onForward(mediaFiles.msgId, filteredMediaFiles[currentIndex]._id)} className="text-white bg-black rounded-full p-2 hover:bg-gray-800">
                  <FaShare />
                </button>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
                  Forward
                </span>
              </div>

              {/* Delete Button with Tooltip */}
              <div className="relative group">
                <button onClick={() => handleDelete(mediaFiles.msgId, filteredMediaFiles[currentIndex]._id, data._id)} className="text-white bg-black rounded-full p-2 hover:bg-gray-800">
                  <FaTrash />
                </button>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
                  Delete
                </span>
              </div>


              {/* Emoji Reactions */}
              <div className="flex gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(
                        emoji,
                        filteredMediaFiles[currentIndex]._id,
                        mediaFiles.msgId,
                        data._id,
                        chatuserinfo.userId,
                         userExists && chatuserinfo.status === 1 ? true:false
                      )}
                    className="text-2xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Selected Reaction */}
            {reactions[currentIndex] && (
              <div className="absolute bottom-20 left-10 text-4xl">{reactions[currentIndex]}</div>
            )}
          </>
          : ""
        }


      </div>
    </div>,
    document.body
  );
};

export default MediaViewer;
