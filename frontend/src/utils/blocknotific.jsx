import ReactDOM from 'react-dom';
import { FaUserSlash, FaTimes } from 'react-icons/fa';

const Blocknotific = ({ onClose, showBlockNotification }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl shadow-2xl max-w-sm w-[90%] transition-all animate-in zoom-in-95 duration-200 text-center">
        
        {/* Close Button */}
        <button 
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          onClick={onClose}
        >
          <FaTimes className="text-sm" />
        </button>

        {/* Icon Header */}
        <div className="flex flex-col items-center">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
            <FaUserSlash className="text-2xl" />
          </div>

          <h2 className="text-lg font-bold text-slate-100 mb-1">Blocked User</h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            You need to unblock this user to send a <span className="font-semibold text-slate-200">{showBlockNotification.reaction}</span>.
          </p>
        </div>

        {/* Action Button */}
        <button
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
          onClick={onClose}
        >
          OK
        </button>

      </div>
    </div>,
    document.body
  );
};

export default Blocknotific;