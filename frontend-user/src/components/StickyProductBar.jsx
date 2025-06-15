// src/components/StickyProductBar.js (File mới)

import React from 'react';

const StickyProductBar = ({ product, quantity, formatPrice, handleAddToCart }) => {
    return (
        <div className="sticky top-0 bg-white shadow-md z-40 w-full transition-transform duration-300">
            <div className="max-w-[80%] mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <img src={`/product/${product.imageUrls[0]}`} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                        <p className="font-semibold text-lg">{product.name}</p>
                        <p className="text-gray-600">{formatPrice(product.price)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="flex items-center border rounded-full px-2">
                        <span>Số lượng:</span>
                        <span className="font-bold text-lg mx-2">{quantity}</span>
                     </div>
                    <button
                        onClick={handleAddToCart}
                        className="bg-black text-white py-2 px-6 rounded-full font-semibold hover:bg-gray-800"
                    >
                        Chọn kích thước
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StickyProductBar;