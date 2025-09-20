import { useEffect, useRef, useState } from "react";
import { backendbaseurl } from "../../../baseurl/baseurl";
import axios from "axios";
import { format } from "timeago.js";




const MediaReactions = ({ socket, msgid,setMsgid, loginuser, chatuser, setUpdatemsgs }) => {

  const [userReaction, setMediaReaction] = useState({});
  const [updatemediareaction, setupdatemeidareaction] = useState('')
  const reactionexist = userReaction.media?.some((media) => media.reactions.length > 0)
  const containerRef = useRef(null);


  const undoMessagereaction = async (msgId, mediaId, reactionId) => {

    try {
      const result = await axios.post(`${backendbaseurl}/api/chat/undomediareaction`, { msgId, mediaId, reactionId }, { withCredentials: true });
     
      socket?.emit('mediareaction', { msg: result.data, senderid: loginuser, receiverid: chatuser });
       setUpdatemsgs(Date.now());
       setupdatemeidareaction(Date.now())
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


  //handle click outside
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
      {reactionexist &&

        <div 
        ref={containerRef}
        className='custom-scrollbar absolute -left-4 w-[340px] -bottom-0 z-50 h-32 overflow-auto bg-white rounded shadow p-4'>
        
          <button
            className="text-black float-right text-xs"
            onClick={() => setMsgid('')}
          >
            X
          </button>
          <table className="table-auto w-full rounded-sm">
            <thead>
              <tr className="bg-gray-100 text-black text-[8px]">
                <th className="px-2 py-1">Media</th>
                <th className="px-2 py-1">Reactions</th>
              </tr>
            </thead>
            <tbody>
              {userReaction?.media?.map((mediaItem, mIndex) =>
              [...mediaItem.reactions].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
                .map((reaction, rIndex) => (
                  <tr key={`${mIndex}-${rIndex}`}>
                    <td className="px-2 py-1 flex items-center">
                      {["jpg", "jpeg", "png", "gif", "webp"].includes(reaction.text.split(".").pop().toLowerCase()) ? (
                        <>
                          <img
                          src={`${backendbaseurl}/images/${reaction.text}`}
                          alt="media"
                          className="w-10 object-cover rounded mr-2"
                        />
                        <span className="text-xs text-black">{format(reaction.updatedAt)}</span>
                        </>
                      
                      ) : ["mp4", "avi", "mov"].includes(reaction.text.split(".").pop().toLowerCase()) ? (
                        <>
                        <video
                          src={`${backendbaseurl}/videos/${reaction.text}`}
                          className="w-10 object-cover rounded mr-2"
                          controls
                        />
                        <span className="text-xs text-black">{format(reaction.updatedAt)}</span>
                        </>
                      ) : null}
                    </td>
                    <td className="px-2 py-1 cursor-pointer"
                     
                     onClick={() =>
                          reaction.user._id === loginuser &&
                          undoMessagereaction(msgid, mediaItem._id, reaction._id)
                        }
                    
                    >
                      <span
                        className="text-sm"
                        
                      >

                        {reaction.emoji}

                      </span>
                      <span className="text-xs text-gray-700">
                        {reaction.user?.name}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      }
    </>
  );
};

export default MediaReactions;
