import React from "react";
import {
  FaComments,
  FaUserFriends,
  FaLock,
  FaShieldAlt,
  FaBars,
} from "react-icons/fa";

const SaifTech = ({ setShowUserList }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-sans p-6 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Mobile User List Trigger Button */}
      <button
        className="absolute top-5 left-5 z-20 flex items-center gap-2 lg:hidden px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-indigo-400 border border-slate-800 rounded-xl shadow-lg backdrop-blur-md transition-all active:scale-95 text-sm font-semibold"
        onClick={() => setShowUserList(true)}
      >
        <FaBars />
        <span>Open Chats</span>
      </button>

      {/* Welcome Card Container */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/90 p-8 sm:p-12 rounded-3xl shadow-2xl text-center space-y-8">
        {/* Animated App Logo / Brand Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 text-white">
            <FaComments className="text-4xl" />
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Welcome to Saif Tech Workspace
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Welcome to Saif Chat
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Select a conversation from the sidebar or find users to start
            messaging in real-time.
          </p>
        </div>

        {/* Feature Grid Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col items-center text-center space-y-2">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FaUserFriends className="text-lg" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">
              Real-time Chat
            </h4>
            <p className="text-[11px] text-slate-500">
              Connect instantly with active contacts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col items-center text-center space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <FaLock className="text-lg" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">
              Private & Secure
            </h4>
            <p className="text-[11px] text-slate-500">
              Encrypted workspace for your messaging.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col items-center text-center space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FaShieldAlt className="text-lg" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">
              User Control
            </h4>
            <p className="text-[11px] text-slate-500">
              Manage blocks, chat history & settings.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 text-xs text-slate-600 mt-8">
        © {new Date().getFullYear()} Saif Tech Inc. All rights reserved.
      </div>
    </div>
  );
};

export default SaifTech;
