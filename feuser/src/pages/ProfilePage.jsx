// src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import các component chung
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import authService from '../services/authService';

// Import các component con vừa tạo
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileContent from '../components/profile/ProfileContent';
import FloatingContact from '../components/profile/FloatingContact';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Luôn đặt logic có thể gây lỗi trong try...catch
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        // Nếu không có người dùng đăng nhập, chuyển hướng về trang chủ
        navigate('/');
      } else {
        setUser(currentUser);
      }
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        // Có thể người dùng có dữ liệu hỏng trong localStorage
        authService.logout(); // Đăng xuất để dọn dẹp
        navigate('/login'); // Yêu cầu đăng nhập lại
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    // Bắn ra sự kiện để Navbar có thể cập nhật ngay lập tức
    window.dispatchEvent(new Event('logoutSuccess'));
    navigate('/');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Truyền props vào các component con */}
          <ProfileSidebar active="info" onLogout={handleLogout} />
          <ProfileContent user={user} />
        </div>
      </main>
      <FloatingContact />
      <Footer />
    </div>
  );
};

export default ProfilePage;