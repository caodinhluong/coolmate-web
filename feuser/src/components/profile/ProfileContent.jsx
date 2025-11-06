// src/components/profile/ProfileContent.js

import React from 'react';

const ProfileContent = ({ user }) => {
  // Guard clause: Rất quan trọng để tránh lỗi khi user chưa được tải xong
  if (!user) {
    return (
      <div className="w-full lg:w-3/4 xl:w-4/5 bg-white p-8 rounded-lg shadow-sm">
        Đang tải thông tin...
      </div>
    );
  }

  const infoFields = [
    { label: 'Họ và tên', value: user.full_name || 'Chưa cập nhật' },
    { label: 'Số điện thoại', value: user.phone_number || 'Chưa cập nhật' },
    { label: 'Giới tính', value: user.gender || 'Chưa cập nhật' },
    { label: 'Ngày sinh', value: user.birth_date || <span className="text-gray-500">Hãy cập nhật ngày sinh để coolmate gửi cho bạn 1 phần quà đặc biệt nhé</span> },
    { label: 'Chiều cao', value: user.height ? `${user.height} cm` : 'Chưa cập nhật' },
    { label: 'Cân nặng', value: user.weight ? `${user.weight} kg` : 'Chưa cập nhật' },
  ];

  return (
    <div className="w-full lg:w-3/4 xl:w-4/5 bg-white p-8 rounded-lg shadow-sm">
      {/* Thông tin tài khoản */}
      <div className="pb-8 border-b border-gray-200">
        <h2 className="text-4xl font-bold mb-8">Thông tin tài khoản</h2>
        <div className="space-y-5">
          {infoFields.map(field => (
            <div key={field.label} className="flex items-center">
              <span className="w-1/3 text-gray-500">{field.label}</span>
              <span className="w-2/3 font-medium text-gray-800">{field.value}</span>
            </div>
          ))}
        </div>
        <button className="mt-8 px-8 py-3 border border-gray-400 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          CẬP NHẬT
        </button>
      </div>

      {/* Thông tin đăng nhập */}
      <div className="pt-8">
        <h2 className="text-4xl font-bold mb-8">Thông tin đăng nhập</h2>
        <div className="space-y-5">
          <div className="flex items-center">
            <span className="w-1/3 text-gray-500">Email</span>
            <span className="w-2/3 font-medium text-gray-800">{user.email}</span>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-gray-500">Mật khẩu</span>
            <span className="w-2/3 font-medium text-gray-800">••••••••••••••</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;