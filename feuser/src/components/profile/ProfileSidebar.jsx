// src/components/profile/ProfileSidebar.js

import React from 'react';
import {
  FaUserCircle, FaUsers, FaBoxOpen, FaDollarSign, FaTicketAlt,
  FaMapMarkerAlt, FaStar, FaQuestionCircle, FaSignOutAlt, FaArrowRight
} from 'react-icons/fa';

const ProfileSidebar = ({ active, onLogout }) => {
  const menuItems = [
    { id: 'info', icon: <FaUserCircle />, text: 'Thông tin tài khoản' },
    { id: 'refer', icon: <FaUsers />, text: 'Giới thiệu bạn bè' },
    { id: 'orders', icon: <FaBoxOpen />, text: 'Lịch sử đơn hàng' },
    { id: 'coolcash', icon: <FaDollarSign />, text: 'Lịch sử CoolCash' },
    { id: 'voucher', icon: <FaTicketAlt />, text: 'Ví Voucher' },
    { id: 'address', icon: <FaMapMarkerAlt />, text: 'Sổ địa chỉ' },
    { id: 'reviews', icon: <FaStar />, text: 'Đánh giá và phản hồi' },
    { id: 'faq', icon: <FaQuestionCircle />, text: 'Chính sách & Câu hỏi thường gặp' },
  ];

  return (
    <div className="w-full lg:w-1/4 xl:w-1/5 space-y-2">
      {menuItems.map(item => (
        <div
          key={item.id}
          className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
            active === item.id ? 'bg-black text-white' : 'bg-white hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold">{item.text}</span>
          </div>
          <FaArrowRight />
        </div>
      ))}
      {/* Nút Đăng xuất */}
      <div
        onClick={onLogout}
        className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-white hover:bg-gray-200 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl"><FaSignOutAlt /></span>
          <span className="font-semibold">Đăng xuất</span>
        </div>
        <FaArrowRight />
      </div>
    </div>
  );
};

export default ProfileSidebar;