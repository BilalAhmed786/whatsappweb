import React from 'react';
import ReactDOM from 'react-dom';

const Blocknotific = ({ onClose,showBlockNotification }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-md text-center space-y-4">
        <h2 className="text-xl font-semibold text-white">Blocked User</h2>
        <p className="text-white">You need to unblock this user to send a {showBlockNotification.reaction}.</p>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
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
