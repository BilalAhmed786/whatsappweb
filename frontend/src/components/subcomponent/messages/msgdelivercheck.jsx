import React from 'react';
import { FaCheck } from 'react-icons/fa';

const Msgdelivercheck = ({ msg, data }) => {
  return (
    <div>
      {msg.sender._id === data._id ? (
        msg.isviewed === true && msg.isblocked === false ? (
          <div className="absolute text-[9px] text-indigo-400 right-2 -bottom-3 flex flex-col items-center">
            <FaCheck /><FaCheck className="-mt-1" />
          </div>
        ) : msg.isblocked === false && msg.isviewed === false ? (
          <div className="absolute text-[9px] right-2 -bottom-3 text-slate-400 flex flex-col items-center">
            <FaCheck /><FaCheck className="-mt-1" />
          </div>
        ) : (
          <div className="absolute text-[9px] right-3 -bottom-4 text-slate-400">
            <FaCheck className="-mt-1" />
          </div>
        )
      ) : null}
    </div>
  );
};

export default Msgdelivercheck;