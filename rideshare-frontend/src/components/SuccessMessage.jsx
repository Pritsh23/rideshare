import React from 'react';

export default function SuccessMessage({ message, onClose }) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-green-700 hover:text-green-900 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
}
