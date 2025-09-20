import React from 'react';

const DeleteAccountModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null; // Modal won't render if show is false

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">Are you sure?</h2>
        <p className="mb-6 text-white">Do you really want to delete your account? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}  // Calls the onClose handler when clicked
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            No
          </button>
          <button
            onClick={onConfirm}  // Calls the onConfirm handler for deletion
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
