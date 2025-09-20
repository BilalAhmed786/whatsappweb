import Replymultiplemedia from '../../../utils/replymultiplemedia';
import Replyindividualmedia from '../../../utils/replyindividualmedia';
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
    <div className="custom-scrollbar absolute bg-gray-700 border-l-4 rounded border-red-500 p-3 z-40 opacity-90 bottom-20 -left-1 w-full h-40 flex justify-start items-center overflow-auto">
      <button
        className="absolute right-2 top-2 text-white"
        onClick={() => setReplymessage(false)}
      >
        X
      </button>

      {isMedia ? (
        
        <Replyindividualmedia filename={repliedMsg} />
      
      ) : (
        <p className="text-[18px] text-white break-all p-1">{repliedMsg}</p>
      )}
    </div>
  );
};

export default ReplyMessage;
