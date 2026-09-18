import axios from 'axios';
import React from 'react';
import ReactDOM from "react-dom";
import { FaTrash, FaTimes } from "react-icons/fa";
import { backendbaseurl } from '../baseurl/baseurl';

const Deletemsgs = ({
  forwardmsgids,
  setDeletemsgs,
  setdeleteCheckbox,
  setForwardmsgid,
  loginuserid,
  setUpdatemsgs
}) => {

  const handleDelete = async (msgids, loginuserId) => {
    try {
      await axios.post(`${backendbaseurl}/api/chat/deletemsgs`, { msgids, loginuserId }, { withCredentials: true });
      setdeleteCheckbox(false);
      setUpdatemsgs(Date.now());
    } catch (error) {
      console.log(error);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full z-50 animate-in slide-in-from-top duration-300">
      <div className="mx-auto max-w-4xl mt-3 px-4">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-100 rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Badge & Warning */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="flex items-center justify-center px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold whitespace-nowrap">
              {forwardmsgids.length} selected
            </span>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-tight">
              Are you sure you want to delete these messages? This action cannot be undone.
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            <button
              onClick={() => {
                handleDelete(forwardmsgids, loginuserid);
                setForwardmsgid([]);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <FaTrash className="text-xs" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => {
                setDeletemsgs(false);
                setdeleteCheckbox(false);
                setForwardmsgid([]);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

export default Deletemsgs;