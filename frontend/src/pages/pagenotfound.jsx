import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans relative overflow-hidden p-6">
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl text-center space-y-6">
        
        {/* Saif Chat Brand Logo */}
        <div className="inline-flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Saif Chat
          </span>
        </div>

        {/* 404 Visual Icon */}
        <div className="relative flex items-center justify-center">
          <span className="text-8xl sm:text-9xl font-black text-slate-800 tracking-widest select-none">
            404
          </span>
          <div className="absolute flex flex-col items-center justify-center">
            <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-1 backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Lost in Communication?
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-sm mx-auto">
            Oops! The page or message thread you are looking for doesn’t exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/chat"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 transform active:scale-[0.98]"
          >
            Back to Chat
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl border border-slate-700 transition-all duration-200"
          >
            Home Page
          </Link>
        </div>

      </div>

    </div>
  );
};

export default PageNotFound;