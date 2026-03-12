import React from 'react';

export default function ErrorMessage({ message, onClose }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-700 hover:text-red-900 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
}
