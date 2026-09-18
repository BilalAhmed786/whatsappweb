import Replymultiplemedia from '../../../utils/replymultiplemedia';
import Replyindividualmedia from '../../../utils/replyindividualmedia';
import { FaReply, FaTimes } from 'react-icons/fa';

const ReplyMessage = ({
  replymessage,
  setReplymessage,
  initialLoad
}) => {

  if (!replymessage || !replymessage.repliedmsg) return null;

  const repliedMsg = replymessage.repliedmsg;
  const mediaExtensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm', 'avi', 'mov', 'mp3', 'wav', 'ogg', 'pdf', 'doc', 'docx'];

  if (Array.isArray(repliedMsg) && repliedMsg.length > 0) {
    return Replymultiplemedia(repliedMsg, setReplymessage);
  }

  const fileType = repliedMsg.split(".").pop().toLowerCase();
  const isMedia = mediaExtensions.includes(fileType);

  return (
    <div className="custom-scrollbar absolute bottom-20 -left-1 w-full h-40 z-40 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-xl p-4 flex justify-start items-center overflow-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all">
      
      {/* Left Glowing Accent Pill */}
      <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(34,211,238,0.6)]" />

      {/* Header Badge */}
      <div className="absolute top-2.5 left-4 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-cyan-400 uppercase">
        <FaReply className="text-cyan-400 text-xs" />
        <span>Replying to Message</span>
      </div>

      {/* Dismiss Button */}
      <button
        className="absolute right-3 top-3 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 transition-all duration-200"
        onClick={() => setReplymessage(false)}
        aria-label="Cancel Reply"
      >
        <FaTimes className="text-xs" />
      </button>

      {/* Reply Content Container */}
      <div className="w-full mt-5">
        {isMedia ? (
          <Replyindividualmedia filename={repliedMsg} />
        ) : (
          <p className="text-[15px] leading-relaxed text-slate-200 break-all pl-1 pr-6 font-medium italic">
            "{repliedMsg}"
          </p>
        )}
      </div>
    </div>
  );
};

export default ReplyMessage;