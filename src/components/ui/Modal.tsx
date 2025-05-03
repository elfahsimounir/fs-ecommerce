import { X } from "lucide-react";
import React, { useRef } from "react";

const DetailsModal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div ref={modalRef} className="bg-white border rounded-lg  p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-7 bg-gray-3 hover:text-gray-6 rounded-full p-1"
        >
       <X size={17} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default DetailsModal;
