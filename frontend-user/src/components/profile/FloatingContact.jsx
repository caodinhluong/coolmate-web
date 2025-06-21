// src/components/profile/FloatingContact.js

import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
// Thư viện react-icons không có icon Zalo chính thức, bạn có thể dùng một icon khác hoặc ảnh
// Ở đây tôi dùng một icon placeholder hoặc bạn có thể import ảnh Zalo
import ZaloIcon from '/zalo-icon.png'; // Ví dụ nếu bạn có file SVG

const FloatingContact = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-3 z-50">
      <div className="relative group">
        <div className="bg-white rounded-full p-3 shadow-lg cursor-pointer hover:scale-110 transition-transform">
          <FaPhoneAlt className="text-yellow-500 text-xl" />
        </div>
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Hotline
        </span>
      </div>
      <div className="relative group">
        <div className="bg-blue-500 rounded-full p-3 shadow-lg cursor-pointer hover:scale-110 transition-transform">
           {/* Giả sử bạn có icon Zalo dạng SVG, nếu không có thể dùng icon khác */}
           <img src={ZaloIcon} alt="Zalo" className="w-5 h-5" />
        </div>
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat Zalo
        </span>
      </div>
    </div>
  );
};

export default FloatingContact;