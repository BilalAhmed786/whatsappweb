import { useEffect, useRef, useState } from "react";
import { backendbaseurl } from "../../../baseurl/baseurl";
import axios from "axios";
import { format } from "timeago.js";
import { FaTimes } from "react-icons/fa";

const MediaReactions = ({ socket, msgid, setMsgid, loginuser, chatuser, setUpdatemsgs }) => {
  const [userReaction, setMediaReaction] = useState({});
  const [updatemediareaction, setupdatemeidareaction] = useState('');
  const reactionexist = userReaction.media?.some((media) => media.reactions.length > 0);
  const containerRef = useRef(null);

  const undoMessagereaction = async (msgId, mediaId, reactionId) => {
    try {
      const result = await axios.post(`${backendbaseurl}/api/chat/undomediareaction`, { msgId, mediaId, reactionId }, { withCredentials: true });

      socket?.emit('mediareaction', { msg: result.data, senderid: loginuser, receiverid: chatuser });
      setUpdatemsgs(Date.now());
      setupdatemeidareaction(Date.now());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getMediaReactions = async () => {
      try {
        const result = await axios.get(
          `${backendbaseurl}/api/chat/mediareaction/${msgid}`,
          { withCredentials: true }
        );
        setMediaReaction(result?.data);
      } catch (error) {
        console.error(error.response?.data || error);
      }
    };
    getMediaReactions();
  }, [msgid, updatemediareaction]);

  // handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setMsgid('');
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMsgid]);

  return (
    <>
      {reactionexist && (
        <div 
          ref={containerRef}
          className='custom-scrollbar absolute -left-4 w-[340px] -bottom-0 z-50 h-36 overflow-auto bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-200 rounded-xl shadow-2xl p-3 transition-all'
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Media Reactions</span>
            <button
              className="text-slate-400 hover:text-white transition-colors"
              onClick={() => setMsgid('')}
            >
              <FaTimes size={12} />
            </button>
          </div>

          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 text-slate-400 text-[10px] uppercase font-semibold">
                <th className="pb-1.5 px-1">Media</th>
                <th className="pb-1.5 px-1">Reactions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {userReaction?.media?.map((mediaItem, mIndex) =>
                [...mediaItem.reactions]
                  .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
                  .map((reaction, rIndex) => (
                    <tr key={`${mIndex}-${rIndex}`} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-1.5 px-1 flex items-center">
                        {["jpg", "jpeg", "png", "gif", "webp"].includes(reaction.text.split(".").pop().toLowerCase()) ? (
                          <>
                            <img
                              src={`${reaction.text}`}
                              alt="media"
                              className="w-9 h-9 object-cover rounded-md border border-slate-700/60 mr-2"
                            />
                            <span className="text-[10px] text-slate-400">{format(reaction.updatedAt)}</span>
                          </>
                        ) : ["mp4", "avi", "mov"].includes(reaction.text.split(".").pop().toLowerCase()) ? (
                          <>
                            <video
                              src={`${backendbaseurl}/videos/${reaction.text}`}
                              className="w-9 h-9 object-cover rounded-md border border-slate-700/60 mr-2"
                              controls
                            />
                            <span className="text-[10px] text-slate-400">{format(reaction.updatedAt)}</span>
                          </>
                        ) : null}
                      </td>
                      <td 
                        className="py-1.5 px-1 cursor-pointer"
                        onClick={() =>
                          reaction.user._id === loginuser &&
                          undoMessagereaction(msgid, mediaItem._id, reaction._id)
                        }
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base leading-none transition-transform hover:scale-110">
                            {reaction.emoji}
                          </span>
                          <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">
                            {reaction.user?.name}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default MediaReactions;