import { backendbaseurl } from "../../../baseurl/baseurl";
import axios from "axios";
import { FaReply, FaShare, FaTrashAlt } from "react-icons/fa";

const Dropdown = ({
  msg,
  data,
  setReplymessage,
  setDropdown,
  dropdown,
  setUpdatemsgs,
  textareaRef,
  setCheckbox,
  setForwardmsgid,
  messagedropdown
}) => {

  const replyHandler = (msg) => {
    textareaRef.current.focus();
    setReplymessage(msg);
    setDropdown({});
  };

  const removeMessage = async (userid, msgid) => {
    try {
      await axios.delete(`${backendbaseurl}/api/chat/singlemsgdel/${msgid}`, { withCredentials: true });
      setDropdown({});
      setUpdatemsgs(Date.now());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className={`${msg.sender._id !== data._id ? "absolute top-8 right-0" : "absolute top-8 left-0"} z-50`}>
        {dropdown[msg._id] && (
          <nav
            ref={messagedropdown}
            className="w-32 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl p-1.5 transition-all duration-200 animate-in fade-in zoom-in-95 origin-top"
          >
            <ul className="flex flex-col gap-0.5 text-xs font-medium text-slate-300">
              <li>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-left"
                  onClick={() => {
                    replyHandler({
                      repliedtomsgId: msg._id,
                      repliedmsg: msg.text ? msg.text : msg.media,
                    });
                    setCheckbox(false);
                    setForwardmsgid([]);
                  }}
                >
                  <FaReply className="text-slate-400 text-xs" />
                  <span>Reply</span>
                </button>
              </li>

              <li>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-left"
                  onClick={() => setCheckbox(true)}
                >
                  <FaShare className="text-slate-400 text-xs" />
                  <span>Forward</span>
                </button>
              </li>

              <li>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors text-left"
                  onClick={() => {
                    removeMessage(data._id, msg._id);
                    setCheckbox(false);
                    setForwardmsgid([]);
                  }}
                >
                  <FaTrashAlt className="text-rose-400 text-xs" />
                  <span>Remove</span>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Dropdown;