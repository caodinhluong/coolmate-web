import React, { useState, useEffect, useRef } from 'react';
import CartItem from '../components/CartItem';
import NavBar from '../components/NavBar';
import OrderService from '../services/OrderService.js';

const PayMentPage = () => {
  // Load giỏ hàng từ localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // State để theo dõi các sản phẩm được chọn
  const [selectedItems, setSelectedItems] = useState([]);

  // State để theo dõi phương thức thanh toán
  const [selectedPayment, setSelectedPayment] = useState('cod');

  // State để lưu thông tin người dùng từ input
  const [userInfo, setUserInfo] = useState({
    title: 'Anh',
    name: '',
    phone: '',
    email: '',
    address: '',
    note: '',
    giftWrap: false,
  });

  // State để hiển thị thông báo
  const [message, setMessage] = useState('');

  // Tạo ref cho phần tử thông báo
  const messageRef = useRef(null);

  // Cập nhật localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Cuộn đến thông báo khi message thay đổi
  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [message]);

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
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  // Hàm xóa sản phẩm đã chọn
  const handleRemoveSelected = () => {
    setCartItems(cartItems.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
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
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Hàm xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Tính toán số lượng và giá tiền cho các sản phẩm được chọn
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

  // Hàm xử lý đặt hàng
  const handlePlaceOrder = async () => {
    try {
      if (selectedItems.length === 0) {
        setMessage('Vui lòng chọn ít nhất một sản phẩm để đặt hàng.');
        return;
      }

      if (!userInfo.name || !userInfo.phone || !userInfo.address) {
        setMessage('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ.');
        return;
      }

      const orderData = {
        payment_method: selectedPayment,
        total_amount: totalPrice,
        address: userInfo.address,
        customer_name: `${userInfo.title} ${userInfo.name}`,
        phone: userInfo.phone,
        status: 'pending',
      };

      const orderDetails = selectedCartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      }));

      await OrderService.createOrder(orderData, orderDetails);

      setMessage('Đơn hàng của bạn đã được gửi đi, vui lòng chờ xác nhận từ chúng tôi.');

      setCartItems(cartItems.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      localStorage.setItem('cart', JSON.stringify(
        cartItems.filter((item) => !selectedItems.includes(item.id))
      ));

      setUserInfo({
        title: 'Anh',
        name: '',
        phone: '',
        email: '',
        address: '',
        note: '',
        giftWrap: false,
      });
    } catch (error) {
      setMessage(`Đặt hàng thất bại: ${error.message}`);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        {message && (
          <div
            ref={messageRef}
            className={`p-4 mb-4 rounded ${message.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {message}
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/5 pr-10">
            <h2 className="text-4xl font-semibold mb-4">Thông tin đặt hàng</h2>
            <form className="space-y-4">
              <div>
                <label>Họ và tên: </label>
                <div className="flex items-center space-x-2">
                  <select
                    name="title"
                    value={userInfo.title}
                    onChange={handleInputChange}
                    className="border w-25 h-12 rounded-full px-3 py-2 text-sm text-gray-500"
                  >
                    <option>Anh</option>
                    <option>Chị</option>
                  </select>
                  <input
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ tên của bạn"
                    className="w-full h-12 border rounded-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label>Số điện thoại: </label>
                <input
                  type="text"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại của bạn"
                  className="w-full border h-12 rounded-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400"
                />
              </div>
              <div>
                <label>Email: </label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  placeholder="Theo đơn hàng sẽ được gửi qua Email và ZNS"
                  className="w-full border h-12 rounded-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400"
                />
              </div>
              <div>
                <label>Địa chỉ: </label>
                <input
                  type="text"
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ (ví dụ: 103 Văn Phúc, phường Văn Phúc)"
                  className="w-full border h-12 rounded-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400"
                />
              </div>
              <div>
                <label>Ghi chú: </label>
                <textarea
                  name="note"
                  value={userInfo.note}
                  onChange={handleInputChange}
                  placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
                  className="w-full border rounded-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400"
                  rows="3"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="giftWrap"
                  checked={userInfo.giftWrap}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <label className="text-sm text-gray-700">
                  Gói cho người khác nhận hàng (nếu có)
                </label>
              </div>
            </form>
            <div className="mt-6">
              <h2 className="text-4xl font-semibold mt-10 mb-5">Hình thức thanh toán</h2>
              <div className="space-y-3">
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
                    key={`${item.id}-${item.color}-${item.size}`}
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
            {selectedItems.length > 0 && (
              <button
                className="w-full mt-4 bg-black text-white py-2 rounded-full hover:bg-gray-600"
                onClick={handlePlaceOrder}
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