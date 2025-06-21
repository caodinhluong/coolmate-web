// src/components/OrderStatusTracker.js

import React from 'react';
import { IoLocationSharp, IoCheckmarkCircle } from 'react-icons/io5';
import { TbTruckDelivery } from 'react-icons/tb';
import { BsCircleFill } from 'react-icons/bs';

// Định nghĩa các bước của tiến trình
const steps = [
  { id: 'shipped', label: 'Đã vận chuyển', Icon: BsCircleFill },
  { id: 'departed', label: 'Đã khởi hành', Icon: BsCircleFill },
  { id: 'arrived_vn', label: 'Đã đến Việt Nam', Icon: IoLocationSharp },
  { id: 'out_for_delivery', label: 'Đang giao hàng', Icon: TbTruckDelivery },
  { id: 'delivered', label: 'Đã giao hàng', Icon: IoCheckmarkCircle },
];

const OrderStatusTracker = ({ status, estimatedDelivery }) => {
  // Tìm chỉ số (index) của trạng thái hiện tại trong mảng `steps`
  const currentStatusIndex = steps.findIndex(step => step.id === status);

  return (
    <div className="w-full px-2 sm:px-4 py-4">
        {/* Dòng ngày giao hàng dự kiến */}
        <p className="text-lg font-semibold text-teal-600 mb-8 text-center">
            Ngày giao hàng dự kiến: {estimatedDelivery}
        </p>

        <div className="flex items-start">
        {steps.map((step, index) => {
            const isCompleted = index < currentStatusIndex;
            const isActive = index === currentStatusIndex;
            const isFuture = index > currentStatusIndex;

            // Xác định màu sắc dựa trên trạng thái
            const colorClass = isFuture ? 'text-gray-400' : 'text-teal-500';
            const bgColorClass = isFuture ? 'bg-gray-300' : 'bg-teal-500';

            return (
            <React.Fragment key={step.id}>
              {/* Đường nối giữa các bước */}
              {index > 0 && (
                <div className={`flex-1 h-0.5 mt-3 sm:mt-4 ${bgColorClass}`}></div>
              )}

              {/* Điểm nút (step node) */}
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
  );
};

export default OrderStatusTracker;