import React from 'react'
import { FaArrowRight, FaTimes, FaShare } from 'react-icons/fa'

const Frwdmsgcount = ({ setForwardmsgid, forwardmsgid, setCheckbox, checkbox, setDisplayusers }) => {
  return (
    <div>
      {checkbox && (
        <div className="absolute z-50 -bottom-4 -left-4 w-full h-20 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-xl px-6 mb-5 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all">
          
          {/* Left Glowing Accent Line */}
          <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(34,211,238,0.6)]" />

          {/* Left Content: Cancel Button & Count Badge */}
          <div className="flex items-center gap-4">
            <button
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 transition-all duration-200"
              onClick={() => {
                setForwardmsgid('')
                setCheckbox(false)
              }}
              aria-label="Cancel Selection"
            >
              <FaTimes className="text-xs" />
            </button>

            <div className="flex items-center gap-2">
              <FaShare className="text-cyan-400 text-xs" />
              <span className="text-sm font-semibold tracking-wide text-slate-200">
                {forwardmsgid?.length || 0} selected
              </span>
            </div>
          </div>

          {/* Right Action: Forward Button */}
          {forwardmsgid?.length > 0 && (
            <button
              onClick={() => setDisplayusers(true)}
              className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Forward Messages"
            >
              <FaArrowRight className="text-sm -rotate-45" />
            </button>
          )}

        </div>
      )}
    </div>
  )
}

export default Frwdmsgcount