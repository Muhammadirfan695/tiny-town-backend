"use client";

import Image from "next/image";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  loading = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/Group 36708.svg"
              alt="Localbites Logo"
              width={80}
              height={20}
            />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:bg-red-300"
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
