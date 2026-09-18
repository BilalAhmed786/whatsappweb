import React from 'react';

const Checkbox = ({ msg, checkbox, forwardmsgid, setForwardmsgid, deltecheckbox, setDeletemsgs }) => {
  const toggleMessageSelection = (msgId) => {
    setForwardmsgid((prev) =>
      prev.includes(msgId)
        ? prev.filter((id) => id !== msgId)
        : [...prev, msgId]
    );
  };

  return (
    <div className="flex items-center px-2">
      {checkbox && (
        <input
          className="accent-indigo-500 rounded cursor-pointer"
          type="checkbox"
          checked={forwardmsgid.includes(msg._id)}
          onChange={() => toggleMessageSelection(msg?._id)}
        />
      )}
      {deltecheckbox && (
        <input
          className="accent-rose-500 rounded cursor-pointer"
          type="checkbox"
          checked={forwardmsgid.includes(msg._id)}
          onChange={() => {
            toggleMessageSelection(msg._id);
            if (setDeletemsgs) setDeletemsgs(true);
          }}
        />
      )}
    </div>
  );
};

export default Checkbox;