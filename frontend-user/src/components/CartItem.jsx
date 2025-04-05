import React from 'react';
import { useState } from 'react';

const CartItem = ({ item, onRemove, onSelect, isSelected, onQuantityChange }) => {
    const [selectedSize, setSelectedSize] = useState(item.size); // State để lưu kích thước đã chọn

    // Hàm xử lý khi người dùng thay đổi kích thước
    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
    };
    return (
        <div className="flex items-center justify-between border-b py-4">
            {/* Checkbox và hình ảnh sản phẩm */}
            <div className="flex space-x-4">
                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(item.id)}
                    className="h-3 w-3 text-blue-500 my-auto"
                />
                {/* Hình ảnh sản phẩm */}
                <img
                    src={`/product/${item.image}`}
                    alt={item.name}
                    className="w-30 h-40 object-cover rounded-xl"
                />
                <div>
                    <h3 className="text-sm font-semibold">{item.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                        <h3 className="text-lg text-gray-500">{selectedSize}</h3>
                        <select
                            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedSize} // Giá trị của dropdown đồng bộ với state
                            onChange={handleSizeChange} // Gọi hàm khi người dùng chọn size mới
                        >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </div>
                </div>  
            </div>

            {/* Số lượng và giá */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <button
                        className="border px-2 py-1"
                        onClick={() => onQuantityChange(item.id, -1)}
                    >
                        -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                        className="border px-2 py-1"
                        onClick={() => onQuantityChange(item.id, 1)}
                    >
                        +
                    </button>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold">{item.price.toLocaleString()}đ</p>
                    {item.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                            {item.originalPrice.toLocaleString()}đ
                        </p>
                    )}
                </div>
                <button onClick={() => onRemove(item.id)} className="text-gray-500">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CartItem;