import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import GuestOrderItem from '../components/GuestOrderItem';

const TrackOrderPage = () => {
  const [guestOrders, setGuestOrders] = useState([]); // Danh sách gốc
  const [filteredOrders, setFilteredOrders] = useState([]); // Danh sách để hiển thị
  const [searchTerm, setSearchTerm] = useState(''); // Giá trị ô tìm kiếm
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('guestOrders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders).reverse();
        setGuestOrders(parsedOrders);
        setFilteredOrders(parsedOrders); // Ban đầu hiển thị tất cả
      }
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Hàm xử lý khi người dùng nhập vào ô tìm kiếm
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Nếu ô tìm kiếm trống, hiển thị lại tất cả đơn hàng
    if (term === '') {
      setFilteredOrders(guestOrders);
    } else {
      // Lọc danh sách đơn hàng theo ID
      const filtered = guestOrders.filter(order => 
        order.id.toString().includes(term)
      );
      setFilteredOrders(filtered);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="text-center py-20">Đang tải dữ liệu...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto p-4 md:p-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Theo dõi đơn hàng của bạn</h2>
          <p className="text-center text-gray-600 mb-8">
            Nhập mã đơn hàng của bạn để tìm kiếm nhanh hoặc xem danh sách bên dưới.
          </p>

          {/* Thanh Tìm Kiếm */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Nhập mã đơn hàng..."
                className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Hiển thị kết quả */}
          {guestOrders.length > 0 ? (
            filteredOrders.length > 0 ? (
              <div className="max-w-3xl mx-auto">
                {filteredOrders.map((order) => (
                  <GuestOrderItem key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-10 p-8">
                <h3 className="text-xl font-semibold">Không tìm thấy đơn hàng</h3>
                <p>Không có đơn hàng nào khớp với mã "{searchTerm}".</p>
              </div>
            )
          ) : (
            // Giao diện khi chưa có đơn hàng nào
            <div className="text-center text-gray-500 mt-10 p-8 bg-white rounded-lg shadow-sm max-w-lg mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-700">Chưa có đơn hàng nào</h3>
              <p className="mt-2 text-sm">Sau khi đặt hàng, thông tin sẽ được lưu và hiển thị tại đây.</p>
              <Link to="/" className="mt-6 inline-block bg-black text-white font-bold py-2 px-6 rounded-full hover:bg-gray-800 transition-colors">
                Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrderPage;