import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Hàm định dạng giá: thêm dấu chấm cứ mỗi 3 chữ số
const formatPrice = (price) => {
  if (typeof price !== "number") {
    price = Number(price) || 0;
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const ProductCard = ({ imageUrls, rating, ratingCount, name, price, discount, colors, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null); // State để lưu màu được chọn
  const navigate = useNavigate();

  // Đặt màu đầu tiên làm màu được chọn mặc định khi component load
  useEffect(() => {
    if (colors && colors.length > 0) {
      setSelectedColor(colors[0]);
    }
  }, [colors]);

  // Hàm xử lý khi click vào ảnh hoặc tên
  const handleProductClick = () => {
    navigate(`/product-detail/${id}`, {
      state: { imageUrls, rating, ratingCount, name, price, discount, colors },
    });
  };

  // Hàm xử lý khi click vào màu
  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  console.log("ProductCard1:", id, name, price, discount, rating, ratingCount, colors, imageUrls);

  // Đảm bảo imageUrls là mảng, nếu không thì dùng mảng mặc định
  const safeImageUrls = Array.isArray(imageUrls) ? imageUrls : ["default-image.jpg"];
  // Thêm tiền tố /product/ để truy cập hình ảnh từ public/product
  const imagePaths = safeImageUrls.map((url) => `/product/${url}`);

  return (
    <div className="h-130 min-w-[230px] max-w-[300px] pr-1 bg-white relative rounded-lg flex-shrink-0">
      {/* Image */}
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleProductClick}
      >
        <img
          src={imagePaths[0]}
          alt={name}
          className={`w-full h-97 object-cover rounded-md transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />
        {imagePaths.length > 1 && (
          <img
            src={imagePaths[1]}
            alt={name}
            className={`absolute top-0 left-0 w-full h-96.5 object-cover rounded-md transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        <div className="absolute top-2 right-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
          HOT
        </div>
      </div>

      {/* Rating */}
      <div className="absolute top-2 left-2 flex items-center">
        <span className="text-black-400 mr-1">{rating}★</span>
        <span className="text-blue-600 text-lg">({ratingCount})</span>
      </div>

      {/* Colors */}
      <div className="flex items-center mt-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`w-8.5 h-5 rounded-full border mr-2 cursor-pointer p-0.5 ${
              selectedColor === color ? "border-blue-500 border-2" : "border-gray-300"
            }`} // Thêm padding để tạo khoảng trắng
            onClick={() => handleColorClick(color)}
            title={color.name} // Hiển thị tên màu khi hover
          >
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: color.value }}
            ></div>
          </div>
        ))}
        {colors.length > 5 && <span className="text-sm text-gray-600">+{colors.length - 5}</span>}
      </div>

      {/* Name */}
      <h3
        className="text-[15px] font-medium mt-2 cursor-pointer"
        onClick={handleProductClick}
      >
        {name}
      </h3>

      {/* Price and Discount */}
      <div className="mt-0.5">
        <span className="text-black-600 font-bold">{formatPrice(price)}</span>
        {discount > 0 && (
          <span className="text-gray-500 line-through ml-2">{formatPrice(discount)}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;