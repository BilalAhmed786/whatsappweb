import React, { useContext, useEffect, useState } from "react";
import { FaTimes, FaBan, FaCheck, FaImages, FaUser, FaInfoCircle, FaPlay } from "react-icons/fa";
import { UserContext } from "../contextapi/contextapi";
import Userpic from "../images/user.jpg";
import axios from "axios";
import { backendbaseurl } from "../baseurl/baseurl";

const UserProfile = ({
  setIndmsg,
  openMediaViewer,
  updatemsgs,
  mediamsgupdate
}) => {
  const { fetchUserInfo, socket, data, chatuserinfo } = useContext(UserContext);
  const [media, setMedia] = useState([]);
  const [isBlocking, setIsBlocking] = useState(false);

  // Helper function to resolve absolute Cloudinary URLs vs legacy local backend paths
  const resolveMediaUrl = (path, type = "images") => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${backendbaseurl}/${type}/${path}`;
  };

  // Helper to determine media extension and type from full Cloudinary or local paths
  const getMediaType = (url = "") => {
    const cleanUrl = url.split("?")[0];
    const ext = cleanUrl.split(".").pop().toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) || cleanUrl.includes("/saifchat/images/");
    const isVideo = ["mp4", "avi", "mov", "webm", "mkv"].includes(ext) || cleanUrl.includes("/saifchat/videos/");
    return { ext, isImage, isVideo };
  };

  // Check block statuses
  const isBlockedByMe = data.blockedUsers?.some((user) => user.userId === chatuserinfo.userId);
  const isBlockedByOther = chatuserinfo.blockedUsers?.some((blck) => blck.userId === data._id);

  const blockUser = async (loginid, blockUserId) => {
    try {
      setIsBlocking(true);
      const result = await axios.post(
        `${backendbaseurl}/api/users/blkunblk-user/${loginid}`,
        { blockUserId },
        { withCredentials: true }
      );

      if (result.data) {
        await fetchUserInfo();
        socket?.emit("blockuser", { user: result.data });
      }
    } catch (error) {
      console.error("Block/Unblock Error:", error);
    } finally {
      setIsBlocking(false);
    }
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const result = await axios.get(
          `${backendbaseurl}/api/chat/mediamessage/${chatuserinfo.userId}`,
          { withCredentials: true }
        );

        const allMedia = result.data?.messages?.map((msg) => msg.media).flat() || [];

        // Filter out non-media documents
        const filteredMedia = allMedia.filter((file) => {
          if (!file?.text) return false;
          const { ext } = getMediaType(file.text);
          return !["doc", "docx", "pdf", "webm"].includes(ext);
        });

        setMedia(filteredMedia);
      } catch (error) {
        console.error("Fetch Media Error:", error);
      }
    };

    if (data._id && chatuserinfo.userId) {
      fetchMedia();
    }
  }, [chatuserinfo, data._id, updatemsgs, mediamsgupdate]);

  // Socket listener for new media
  useEffect(() => {
    if (!socket) return;

    const handleAllmedia = (newMsgData) => {
      if (newMsgData?.lastmsg?.media) {
        setMedia((prev) => [...prev, ...newMsgData.lastmsg.media]);
      }
    };

    socket?.on("latestmsg", handleAllmedia);

    return () => {
      socket?.off("latestmsg", handleAllmedia);
    };
  }, [socket]);

  return (
    <div className="custom-scrollbar w-full h-screen overflow-y-auto bg-slate-950 text-slate-100 font-sans border-l border-slate-800 flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <FaUser className="text-indigo-400 text-sm" />
            <h3 className="font-semibold text-sm text-slate-200">Contact Info</h3>
          </div>
          <button
            onClick={() => setIndmsg(1)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Close Drawer"
          >
            <FaTimes className="text-base" />
          </button>
        </div>

        {/* Profile Avatar & Identity Card */}
        <div className="p-6 flex flex-col items-center border-b border-slate-800/80 bg-slate-900/30">
          <div className="relative mb-4">
            <img
              className="w-36 h-36 rounded-full object-cover border-4 border-slate-800 shadow-xl shadow-indigo-500/10"
              src={
                chatuserinfo?.profilepic && !isBlockedByOther
                  ? resolveMediaUrl(chatuserinfo.profilepic, "images")
                  : Userpic
              }
              alt={chatuserinfo.name || "User Avatar"}
            />
            {chatuserinfo.status === 1 && !isBlockedByMe && !isBlockedByOther && (
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-sm">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">{chatuserinfo.name}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {chatuserinfo.email || "Saif Chat Contact"}
          </p>
        </div>

        {/* About Section */}
        <div className="p-6 border-b border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <FaInfoCircle className="text-indigo-400" />
            <span>About</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {chatuserinfo.about || "Hey there! I am using Saif Chat."}
          </p>
        </div>

        {/* Media / Shared Gallery Section */}
        <div className="p-6 border-b border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <FaImages className="text-indigo-400" />
              <span>Media & Gallery</span>
            </div>
            {media?.length > 0 && (
              <span className="text-xs font-medium text-slate-500">
                {media.length} items
              </span>
            )}
          </div>

          {media?.length > 0 ? (
            <div
              className="grid grid-cols-2 gap-2 mt-2 cursor-pointer"
              onClick={() => openMediaViewer(media)}
            >
              {media
                .filter((file) => {
                  const { isImage, isVideo } = getMediaType(file.text);
                  return isImage || isVideo;
                })
                .slice(0, 4)
                .map((file, index) => {
                  const { isImage, isVideo, ext } = getMediaType(file.text);
                  const fileUrl = resolveMediaUrl(file.text, isVideo ? "videos" : "images");

                  return (
                    <div
                      key={index}
                      className="relative group w-full h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80"
                    >
                      {isImage && (
                        <img
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          src={fileUrl}
                          alt={`Media ${index}`}
                        />
                      )}

                      {isVideo && (
                        <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                          <video className="w-full h-full object-cover">
                            <source src={fileUrl} type={`video/${ext || "mp4"}`} />
                          </video>
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <FaPlay className="text-white text-xs" />
                          </div>
                        </div>
                      )}

                      {/* Overlay hover effect */}
                      <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
              <p className="text-xs text-slate-500">No images or videos shared yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer: Block/Unblock */}
      <div className="p-6 bg-slate-900/40">
        <button
          disabled={isBlocking}
          onClick={() => blockUser(data._id, chatuserinfo.userId)}
          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all duration-200 border ${
            isBlockedByMe
              ? "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700"
              : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isBlocking ? (
            <span className="text-xs">Updating status...</span>
          ) : (
            <>
              {isBlockedByMe ? <FaCheck className="text-xs" /> : <FaBan className="text-xs" />}
              <span>{isBlockedByMe ? "Unblock Contact" : "Block Contact"}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default UserProfile;