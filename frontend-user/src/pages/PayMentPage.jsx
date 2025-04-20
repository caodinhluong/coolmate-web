import React, { useState, useEffect } from 'react';
import CartItem from '../components/CartItem';
import NavBar from '../components/NavBar';

const PayMentPage = () => {
  // Load giỏ hàng từ localStorage khi trang được tải
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // State để theo dõi các sản phẩm được chọn
  const [selectedItems, setSelectedItems] = useState([]);

  // State để theo dõi phương thức thanh toán
  const [selectedPayment, setSelectedPayment] = useState('cod');

  // Cập nhật localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Hàm chọn/bỏ chọn sản phẩm
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Hàm chọn tất cả sản phẩm
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); // Bỏ chọn tất cả
    } else {
      setSelectedItems(cartItems.map((item) => item.id)); // Chọn tất cả
    }
  };

  // Hàm xóa sản phẩm đã chọn
  const handleRemoveSelected = () => {
    setCartItems(cartItems.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]); // Reset danh sách đã chọn
  };

  // Hàm xóa một sản phẩm
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  // Hàm cập nhật số lượng sản phẩm
  const handleQuantityChange = (id, change) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change); // Không cho số lượng nhỏ hơn 1
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Tính toán số lượng và giá tiền chỉ cho các sản phẩm được chọn
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );
  const totalQuantity = selectedCartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Phần thông tin đặt hàng (bên trái) */}
          <div className="lg:w-3/5 pr-10">
            <h2 className="text-4xl font-semibold mb-4">Thông tin đặt hàng</h2>
            <form className="space-y-4">
              {/* Họ và tên */}
              <div>
                <label>Họ và tên: </label>
                <div className="flex items-center space-x-2">
                  <select className="border w-25 h-12 rounded-full px-3 py-2 text-sm text-gray-500">
                    <option>Anh</option>
                    <option>Chị</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Nhập họ tên của bạn"
                    className="w-full h-12 border rounded-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label>Số điện thoại: </label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại của bạn"
                  className="w-full border h-12 rounded-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400"
                />
              </div>

              {/* Email */}
              <div>
                <label>Email: </label>
                <input
                  type="email"
                  placeholder="Theo đơn hàng sẽ được gửi qua Email và ZNS"
                  className="w-full border h-12 rounded-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400"
                />
              </div>

              {/* Địa chỉ */}
              <div>
                <label>Địa chỉ: </label>
                <input
                  type="text"
                  placeholder="Địa chỉ (ví dụ: 103 Văn Phúc, phường Văn Phúc)"
                  className="w-full border h-12 rounded-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400"
                />
              </div>

            
              {/* Ghi chú thêm */}
              <div>
                <label>Ghi chú: </label>
                <textarea
                  placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
                  className="w-full border rounded-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400"
                  rows="3"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4" />
                <label className="text-sm text-gray-700">
                  Gói cho người khác nhận hàng(nếu có)
                </label>
              </div>
            </form>
            <div className="mt-6">
              <h2 className="text-4xl font-semibold mt-10 mb-5">Hình thức thanh toán</h2>
              <div className="space-y-3">
                {/* Thanh toán khi nhận hàng */}
                <label className="flex items-center p-3 border rounded-2xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={selectedPayment === 'cod'}
                    onChange={() => setSelectedPayment('cod')}
                    className="h-5 w-5 text-blue-500"
                  />
                  <div className="ml-3 flex items-center">
                    <img src="/PTTT-COD.png" className="w-10 h-10" alt="COD" />
                    <span className="ml-2 text-sm">Thanh toán khi nhận hàng</span>
                  </div>
                </label>

                {/* Ví MoMo */}
                <label className="flex items-center p-3 border rounded-2xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="momo"
                    checked={selectedPayment === 'momo'}
                    onChange={() => setSelectedPayment('momo')}
                    className="h-5 w-5 text-blue-500"
                  />
                  <div className="ml-3 flex items-center">
                    <img src="/PTTT-vi-momo.png" className="w-10 h-10" alt="MoMo" />
                    <span className="ml-2 text-sm">Ví MoMo</span>
                  </div>
                </label>

                {/* Thanh toán qua ZaloPay */}
                <label className="flex items-center p-3 border rounded-2xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="zalopay"
                    checked={selectedPayment === 'zalopay'}
                    onChange={() => setSelectedPayment('zalopay')}
                    className="h-5 w-5 text-blue-500"
                  />
                  <div className="ml-3 flex items-center">
                    <img src="/PTTT-zalo-pay.png" className="w-10 h-10" alt="ZaloPay" />
                    <div className="flex-1">
                      <span className="text-sm">Thanh toán qua ZaloPay</span>
                    </div>
                  </div>
                </label>

                {/* Thanh toán qua VNPAY */}
                <label className="flex items-center p-3 border rounded-2xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    checked={selectedPayment === 'vnpay'}
                    onChange={() => setSelectedPayment('vnpay')}
                    className="h-5 w-5 text-blue-500"
                  />
                  <div className="ml-3 flex items-center">
                    <img src="/PTTT-vi-dien-tu-vn-pay.png" className="w-10 h-10" alt="VNPAY" />
                    <div className="flex-1">
                      <span className="text-sm">Ví điện tử VN Pay</span>
                    </div>
                  </div>
                </label>

                <h2 className="text-gray-600 font-semibold text-sm">
                  Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có thể trả lại sản phẩm. Tìm hiểu thêm{' '}
                  <a className="text-blue-800 underline">tại đây</a>.
                </h2>
              </div>
            </div>
          </div>

          {/* Phần danh sách sản phẩm (bên phải) */}
          <div className="lg:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-4xl font-semibold">Giỏ hàng</h3>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-500"
              />
              <span className="text-sm">Chọn tất cả</span>
              {selectedItems.length > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  className="text-red-500 text-sm ml-4"
                >
                  Xóa ({selectedItems.length})
                </button>
              )}
            </div>
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Giỏ hàng của bạn đang trống</p>
              ) : (
                cartItems.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.color}-${item.size}`} // Đảm bảo key duy nhất
                    item={item}
                    onRemove={handleRemoveItem}
                    onSelect={handleSelectItem}
                    isSelected={selectedItems.includes(item.id)}
                    onQuantityChange={handleQuantityChange}
                  />
                ))
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm">Số lượng</p>
              <p className="text-sm font-semibold">{totalQuantity}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm">Giá</p>
              <p className="text-sm font-semibold">
                {totalPrice.toLocaleString()} đ
              </p>
            </div>
            {/* Nút đặt hàng */}
            {selectedItems.length > 0 && (
              <button
                className="w-full mt-4 bg-black text-white py-2 rounded-full hover:bg-gray-600"
                onClick={() => {
                  // Logic xử lý đặt hàng với selectedItems
                  console.log('Đặt hàng:', selectedCartItems, 'Phương thức thanh toán:', selectedPayment);
                }}
              >
                Đặt hàng ({selectedItems.length} sản phẩm)
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PayMentPage;