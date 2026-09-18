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
  // Helper to extract clean file extension from full URL or path
  const getFileExtension = (url = "") => {
    const cleanUrl = url.split("?")[0];
    return cleanUrl.split(".").pop().toLowerCase();
  };

  // Helper to check if a URL or file object is a video
  const isVideo = (fileObj) => {
    const text = fileObj?.text || "";
    const ext = getFileExtension(text);
    const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];
    
    return (
      videoExtensions.includes(ext) || 
      text.includes("/video/upload/") || 
      text.includes("/saifchat/videos/")
    );
  };

  // Helper to resolve full CDN URL vs local backend path
  const getMediaUrl = (fileObj) => {
    const url = fileObj?.text || "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `${backendbaseurl}/${isVideo(fileObj) ? "videos" : "images"}/${url}`;
  };

  // Helper for sender profile picture
  const getProfilePicUrl = (picPath) => {
    if (!picPath) return "";
    if (picPath.startsWith("http://") || picPath.startsWith("https://")) {
      return picPath;
    }
    return `${picPath}`;
  };

  // Filter out non-media document files (PDFs, docs)
  const filteredMediaFiles = (mediaFiles?.mediaFiles || []).filter((file) => {
    const ext = getFileExtension(file?.text || "");
    return !["pdf", "doc", "docx"].includes(ext);
  });

  const { data, socket, chatuserinfo } = useContext(UserContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reactions, setReactions] = useState({});

  const replyHandler = (msg) => {
    textareaRef.current?.focus();
    setReplymessage(msg);
    onClose();
  };

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

  // Download media via your backend proxy route
  const downloadMedia = () => {
    const currentMedia = filteredMediaFiles[currentIndex];
    const mediaUrl = getMediaUrl(currentMedia);
    
    // Extract a clean file name from path or default fallback
    const rawFileName = currentMedia.text.split("/").pop().split("?")[0];
    const fileName = rawFileName || `download_${Date.now()}`;

    const downloadEndpoint = `${backendbaseurl}/api/files/download?url=${encodeURIComponent(mediaUrl)}&filename=${encodeURIComponent(fileName)}`;
    
    const link = document.createElement("a");
    link.href = downloadEndpoint;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle emoji reaction
  const handleReaction = async (emoji, objectId, msgId, userId, chatuserid, isviewed) => {
    if (data.blockedUsers?.some((user) => user.userId === chatuserid)) {
      setShowBlockNotification({ reaction: "reaction" });
      return;
    }

    setReactions((prevState) => ({
      ...prevState,
      [currentIndex]: emoji,
    }));

    try {
      const result = await axios.post(
        `${backendbaseurl}/api/chat/mediareaction/${msgId}`,
        { emoji, objectId, userId, chatuserid, isviewed },
        { withCredentials: true }
      );

      setUpdatemsgs(Date.now());
      socket?.emit("mediareaction", { msg: result.data, senderid: userId, receiverid: chatuserid });
    } catch (error) {
      console.error("Reaction error:", error);
    }
  };

  // Handle delete media
  const handleDelete = async (msgId, objectId, userId) => {
    try {
      await axios.post(
        `${backendbaseurl}/api/chat/deletesingleMedia/${msgId}`,
        { objectId, userId },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  // Handle forward message
  const onForward = (msgId, objectId) => {
    setDisplayusers(true);
    setForwardmsgid(msgId);
    setForwardmsgobjid(objectId);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (filteredMediaFiles.length === 0) {
    return null;
  }

  const currentFile = filteredMediaFiles[currentIndex];
  const currentMediaUrl = getMediaUrl(currentFile);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white bg-slate-800/80 hover:bg-slate-700 px-4 py-2 rounded-lg z-50 transition-all font-medium text-sm"
      >
        Close
      </button>

      {/* Sender Profile Header */}
      <div className="absolute top-5 left-5 flex items-center gap-3 z-50">
        {mediaFiles.sender?.profilepicture ? (
          <img
            src={getProfilePicUrl(mediaFiles.sender.profilepicture)}
            alt="User Profile"
            className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-md"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            {mediaFiles.sender?.name?.charAt(0) || "U"}
          </div>
        )}
        <span className="text-white font-medium text-sm drop-shadow">
          {mediaFiles.sender?.name || "Shared Media"}
        </span>
      </div>

      {/* Media Carousel Area */}
      <div className="w-full h-full flex flex-col justify-center items-center relative p-4">
        {isVideo(currentFile) ? (
          <video
            src={currentMediaUrl}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        ) : (
          <img
            src={currentMediaUrl}
            alt={`media-${currentIndex}`}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        )}

        {/* Navigation Arrows */}
        {filteredMediaFiles.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-slate-800/80 hover:bg-slate-700 text-white p-3 rounded-full z-50 transition-all"
            >
              &#8592;
            </button>
            <button
              onClick={goToNext}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-slate-800/80 hover:bg-slate-700 text-white p-3 rounded-full z-50 transition-all"
            >
              &#8594;
            </button>
          </>
        )}

        {/* Floating Action Controls */}
        {mediaFiles.msgId && (
          <>
            <div className="absolute top-20 left-5 flex flex-wrap gap-3 z-50">
              {/* Download */}
              <div className="relative group">
                <button
                  onClick={downloadMedia}
                  className="text-white bg-slate-900/80 p-2.5 rounded-full hover:bg-slate-800 border border-slate-700 transition-all"
                >
                  <FaDownload className="text-sm" />
                </button>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Download
                </span>
              </div>

              {/* Reply */}
              <div className="relative group">
                <button
                  className="text-white bg-slate-900/80 p-2.5 rounded-full hover:bg-slate-800 border border-slate-700 transition-all"
                  onClick={() =>
                    replyHandler({
                      objectId: currentFile._id,
                      repliedtomsgId: mediaFiles.msgId,
                      repliedmsg: currentMediaUrl,
                    })
                  }
                >
                  <FaReply className="text-sm" />
                </button>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Reply
                </span>
              </div>

              {/* Forward */}
              <div className="relative group">
                <button
                  onClick={() => onForward(mediaFiles.msgId, currentFile._id)}
                  className="text-white bg-slate-900/80 p-2.5 rounded-full hover:bg-slate-800 border border-slate-700 transition-all"
                >
                  <FaShare className="text-sm" />
                </button>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Forward
                </span>
              </div>

              {/* Delete */}
              <div className="relative group">
                <button
                  onClick={() => handleDelete(mediaFiles.msgId, currentFile._id, data._id)}
                  className="text-white bg-slate-900/80 p-2.5 rounded-full hover:bg-rose-900/80 border border-slate-700 transition-all"
                >
                  <FaTrash className="text-sm" />
                </button>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Delete
                </span>
              </div>

              {/* Emoji Reactions Bar */}
              <div className="flex gap-1.5 bg-slate-900/80 p-1.5 rounded-full border border-slate-700">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() =>
                      handleReaction(
                        emoji,
                        currentFile._id,
                        mediaFiles.msgId,
                        data._id,
                        chatuserinfo?.userId,
                        userExists && chatuserinfo?.status === 1
                      )
                    }
                    className="text-xl hover:scale-125 transition-transform px-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Reaction Overlay */}
            {reactions[currentIndex] && (
              <div className="absolute bottom-10 left-10 text-4xl animate-bounce">
                {reactions[currentIndex]}
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default MediaViewer;