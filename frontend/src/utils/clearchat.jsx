import axios from 'axios';
import React from 'react';
import ReactDOM from "react-dom";
import { FaTrash, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { backendbaseurl } from '../baseurl/baseurl';

const clearchat = ({
  messagesIds,
  setChatclear,
  chatuser,
  loginuserid,
  setUpdatemsgs
}) => {

  const clearAllmsgs = async (msgids, loginuserId) => {
    try {
      await axios.post(`${backendbaseurl}/api/chat/clearmsgs`, { msgids, loginuserId }, { withCredentials: true });
      setUpdatemsgs(Date.now());
      setChatclear(false);
    } catch (error) {
      console.log(error);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl shadow-2xl max-w-sm w-[90%] transition-all animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          onClick={() => setChatclear(false)}
        >
          <FaTimes className="text-sm" />
        </button>

        {/* Modal Header & Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-4">
            <FaExclamationTriangle className="text-2xl" />
          </div>

          <h2 className="text-lg font-bold text-slate-100 mb-1">Clear Chat History?</h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            All messages between you and <span className="font-semibold text-slate-200">{chatuser}</span> will be permanently deleted. This action cannot be undone.
          </p>
        </div>

        {/* Modal Footer / Actions */}
        <div className="flex items-center gap-3">
          <button
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-95"
            onClick={() => setChatclear(false)}
          >
            Cancel
          </button>

          <button
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/25 transition-all active:scale-95"
            onClick={() => clearAllmsgs(messagesIds, loginuserid)}
          >
            <FaTrash className="text-xs" />
            <span>Clear Chat</span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default clearchat;