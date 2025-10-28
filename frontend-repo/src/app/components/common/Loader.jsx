"use client";

export default function Loader({ size = "8" }) {
  const sizeClasses = `h-${size} w-${size}`;

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-green-600 ${sizeClasses}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <Loader size="12" />
    </div>
  );
}
