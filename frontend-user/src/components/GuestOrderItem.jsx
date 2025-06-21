import React, { useState } from 'react';
// Import các icon cần thiết
import { IoLocationSharp, IoCheckmarkCircle } from 'react-icons/io5';
import { TbTruckDelivery } from 'react-icons/tb';
import { BsCircleFill } from 'react-icons/bs';

const GuestOrderItem = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // --- BẮT ĐẦU PHẦN LOGIC MỚI ---

  /**
   * Tính toán và định dạng ngày giao hàng dự kiến.
   * @param {string | Date} orderDate - Ngày đặt hàng.
   * @returns {string} - Chuỗi ngày giao hàng dự kiến (ví dụ: "23 Th07 - 25 Th07").
   */
  const calculateEstimatedDelivery = (orderDate) => {
    // Nếu không có ngày đặt hàng, trả về chuỗi mặc định
    if (!orderDate) {
      return "Đang cập nhật";
    }
    
    const startDate = new Date(orderDate);
    // Kiểm tra xem ngày có hợp lệ không
    if (isNaN(startDate.getTime())) {
      return "Đang cập nhật";
    }

    // Hàm nhỏ để định dạng ngày thành "DD ThMM"
    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1; // getMonth() bắt đầu từ 0
      const formattedMonth = month < 10 ? `0${month}` : month;
      return `${day} Th${formattedMonth}`;
    };

    // Tính ngày bắt đầu giao (ngày đặt + 3 ngày)
    const estimatedStart = new Date(startDate);
    estimatedStart.setDate(startDate.getDate() + 3);

    // Tính ngày kết thúc giao (ngày đặt + 5 ngày)
    const estimatedEnd = new Date(startDate);
    estimatedEnd.setDate(startDate.getDate() + 5);

    return `${formatDate(estimatedStart)} - ${formatDate(estimatedEnd)}`;
  };

  // Gọi hàm để lấy chuỗi ngày giao hàng
  const estimatedDeliveryString = calculateEstimatedDelivery(order.date);

  // --- KẾT THÚC PHẦN LOGIC MỚI ---
  

  const timelineSteps = [
    { id: 'pending', label: 'Chờ xác nhận', Icon: BsCircleFill },
    { id: 'confirmed', label: 'Đã xác nhận', Icon: BsCircleFill },
    { id: 'shipping', label: 'Đang giao hàng', Icon: TbTruckDelivery },
    { id: 'completed', label: 'Đã giao hàng', Icon: IoCheckmarkCircle },
  ];

  const currentStatusIndex = timelineSteps.findIndex(step => step.id === order.status);

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm bg-white transition-shadow hover:shadow-md">
      {/* Phần thông tin tóm tắt */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-2 sm:mb-0">
          <h4 className="font-bold text-lg text-gray-800">Đơn hàng #{order.id}</h4>
          <p className="text-sm text-gray-500">
            Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}
          </p>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto">
          <p className="font-bold text-xl text-red-600">{order.total.toLocaleString()} đ</p>
        </div>
      </div>

      {/* Thanh tiến trình */}
      <div className="w-full px-2 sm:px-4 py-4 mt-4">
          {/* Dòng ngày giao hàng dự kiến đã được cập nhật */}
          <p className="text-lg font-semibold text-teal-600 mb-8 text-center">
              Ngày giao hàng dự kiến: {estimatedDeliveryString}
          </p>

          <div className="flex items-start">
            {timelineSteps.map((step, index) => {
                const isCompleted = index < currentStatusIndex;
                const isActive = index === currentStatusIndex;
                const isFuture = index > currentStatusIndex;
                const colorClass = isFuture ? 'text-gray-400' : 'text-teal-500';
                const bgColorClass = isFuture ? 'bg-gray-300' : 'bg-teal-500';

                return (
                  <React.Fragment key={step.id}>
                    {index > 0 && (
                      <div className={`flex-1 h-0.5 mt-3 sm:mt-4 ${bgColorClass}`}></div>
                    )}
                    <div className="flex flex-col items-center mx-1">
                      <div className={`relative flex items-center justify-center p-1 rounded-full ${isActive ? 'bg-teal-100' : ''}`}>
                        <step.Icon 
                          className={`
                            ${colorClass} 
                            ${isActive ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-4 h-4 sm:w-5 sm:h-5'}
                            transition-all duration-300
                          `} 
                        />
                      </div>
                      <p className={`
                          text-xs sm:text-sm text-center mt-2 whitespace-nowrap 
                          ${isFuture ? 'text-gray-500' : 'text-gray-800 font-semibold'}
                      `}>
                        {step.label}
                      </p>
                    </div>
                  </React.Fragment>
                );
            })}
          </div>
      </div>

      {/* Nút xem chi tiết sản phẩm */}
      <div className="mt-2 text-center border-t pt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          {isExpanded ? 'Ẩn chi tiết sản phẩm' : 'Xem chi tiết sản phẩm'}
        </button>
      </div>

      {/* Phần chi tiết sản phẩm (ẩn/hiện) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          {order.items.map((item, index) => {
            const firstImage = item.image ? item.image.split(',')[0].trim() : 'default-image.jpg';
            const imageUrl = `/product/${firstImage}`;

            return (
              <div key={index} className="flex items-center mb-3">
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4 border"
                  onError={(e) => { e.target.onerror = null; e.target.src="/default-image.jpg" }}
                />
                <div className="flex-grow">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} - Số lượng: {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-gray-700 font-semibold">
                  {(item.price * item.quantity).toLocaleString()} đ
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GuestOrderItem;