import React, { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Link, useNavigate } from "react-router-dom"; // Link đã được import sẵn
import LoginModal from './LoginModal';
import '../styles/_navbar.scss';
import '../styles/index.css';
import iconCart from '../assets/icon-cart-new-v2.svg';
import productService from '../services/ProductService';
import authService from '../services/authService';


const NavBar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ===== BƯỚC 2: THÊM STATE ĐỂ LƯU THÔNG TIN NGƯỜI DÙNG =====
  // Khởi tạo state với người dùng hiện tại từ localStorage (nếu có)
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  const navigate = useNavigate(); // Hook để điều hướng
  const searchContainerRef = useRef(null); // Ref để xử lý click ra ngoài

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };
  // ===== BƯỚC 3: HÀM XỬ LÝ ĐĂNG XUẤT =====
  const handleLogout = () => {
    authService.logout(); // Xóa thông tin user khỏi localStorage
    setCurrentUser(null); // Cập nhật state để re-render giao diện
    navigate('/'); // Điều hướng về trang chủ
  };
  // ===== HÀM MỚI XỬ LÝ TÌM KIẾM =====
  const handleSearch = (event) => {
    // Chỉ thực hiện khi người dùng nhấn phím 'Enter' và có nội dung tìm kiếm
    if (event.key === 'Enter' && searchTerm.trim() !== '') {
      event.preventDefault(); // Ngăn hành vi mặc định (nếu có)
      // Điều hướng đến trang kết quả tìm kiếm với query string
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  useEffect(() => {
    // ===== BƯỚC 4: LẮNG NGHE SỰ KIỆN ĐĂNG NHẬP THÀNH CÔNG =====
    // Hàm này sẽ được gọi khi có sự kiện 'loginSuccess' được bắn ra
    const handleLoginSuccess = () => {
      setCurrentUser(authService.getCurrentUser());
      setIsLoginOpen(false); // Tự động đóng modal sau khi đăng nhập thành công
    };

    // Đăng ký lắng nghe sự kiện
    window.addEventListener('loginSuccess', handleLoginSuccess);

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, []); // useEffect này chỉ chạy một lần khi component được mount

  useEffect(() => {
    // Nếu không có nội dung tìm kiếm, ẩn gợi ý và không làm gì cả
    if (searchTerm.trim() === '') {
      setShowSuggestions(false);
      return;
    }

    // Thiết lập một timer. API sẽ chỉ được gọi sau khi người dùng ngừng gõ 300ms
    const delayDebounceFn = setTimeout(async () => {
      const results = await productService.getSearchSuggestions(searchTerm);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 300);

    // Dọn dẹp: Hủy timer nếu người dùng tiếp tục gõ
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // useEffect này sẽ chạy lại mỗi khi `searchTerm` thay đổi

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    // Thêm event listener
    document.addEventListener("mousedown", handleClickOutside);
    // Dọn dẹp listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name); // Cập nhật ô input (tùy chọn)
    setShowSuggestions(false); // Ẩn danh sách gợi ý
    navigate(`/search?query=${encodeURIComponent(suggestion.name)}`); // Điều hướng tới trang kết quả
    setSearchTerm(''); // Xóa nội dung ô tìm kiếm 
  };
  useEffect(() => {
    // Hàm này có thể được cải tiến để cập nhật giỏ hàng theo thời gian thực
    // nếu giỏ hàng có thể thay đổi ở các trang khác.
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const uniqueItems = cart.length;
      setCartCount(uniqueItems);
    };

    updateCartCount();

    // Lắng nghe sự kiện storage để cập nhật nếu giỏ hàng thay đổi ở tab khác
    window.addEventListener('storage', updateCartCount);

    // Tạo một custom event để lắng nghe từ các component khác
    window.addEventListener('cartUpdated', updateCartCount);

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <div className="navbar flex flex-col">
      <div className="topbar border-b border-gray-300">
        <div className="container mx-auto px-4 py-1.5 flex justify-between items-center">
          <ul className="flex">
            {/* ... */}
          </ul>
          <ul className="flex items-center"> {/* Thêm items-center */}
            <li><span className="font-extrabold">CoolClub</span></li>
            <li><span className="divider mx-2 font-thin">|</span><span className="font-extrabold">Blog</span></li>
            <li>
              <span className="divider mx-2 font-thin">|</span>
              <Link to="/track-order" className="font-extrabold hover:underline">
                Theo dõi đơn hàng
              </Link>
            </li>
            <li><span className="divider mx-2 font-thin">|</span><span className="font-extrabold">Trung tâm CSKH</span></li>
            {/* ===== BƯỚC 5: RENDER CÓ ĐIỀU KIỆN CHO PHẦN ĐĂNG NHẬP/TÊN USER ===== */}
            {currentUser ? (
              <>
                <li>
                  <span className="divider mx-2 font-thin">|</span>
                  <span className="font-extrabold">
                    Xin chào, {currentUser.full_name}
                  </span>
                </li>
                <li>
                  <span className="divider mx-2 font-thin">|</span>
                  <span
                    className="font-extrabold cursor-pointer hover:underline"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </span>
                </li>
              </>
            ) : (
              <li>
                <span className="divider mx-2 font-thin">|</span>
                <span
                  className="font-extrabold cursor-pointer hover:underline"
                  onClick={handleOpenLogin}
                >
                  Đăng nhập
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="header bg-white border-b border-gray-200">
        <div className="container mx-auto px-2 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/"><img src="/logo.png" className="w-[100px] cursor-pointer" alt="Logo" /></Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/nam-navbar" className="mx-5 text-black-700 font-bold hover:text-black cursor-pointer">NAM</Link>
            <Link to="/nu-navbar" className="mx-5 text-black-700 font-bold hover:text-black cursor-pointer">NỮ</Link>
            <Link to="/sportwear" className="mx-5 text-black-700 font-bold hover:text-black cursor-pointer">THỂ THAO</Link>
            <Link to="/care-share" className="mx-5 text-black-700 font-bold hover:text-black cursor-pointer">CARE & SHARE</Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={searchContainerRef}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="border border-neutral-400 rounded-4xl py-1 px-2 w-60 h-12 [&::placeholder]:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => searchTerm && suggestions.length > 0 && setShowSuggestions(true)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.product_id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ===== BƯỚC 6: RENDER CÓ ĐIỀU KIỆN CHO AVATAR/ICON USER ===== */}
            {currentUser && currentUser.avatar_url ? (
              // Nếu đã đăng nhập và có avatar, hiển thị ảnh
              <img
                src={`/avt/${currentUser.avatar_url}`}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                // Bạn có thể thêm onClick để điều hướng tới trang cá nhân
                onClick={() => navigate('/profile')}
              />
            ) : (
              // Nếu chưa đăng nhập, hiển thị icon user
              <span
                className="text-black-500 cursor-pointer text-2xl"
                onClick={handleOpenLogin}
              >
                <i className="fas fa-user"></i>
              </span>
            )}

            <Link to="/payment" className="relative cursor-pointer text-2xl">
              <img src={iconCart} alt="Cart" className="w-6 h-6 mb-1" />
              {cartCount > 0 && (
                <span className="absolute -bottom-1 -right-1.5 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      <div className="bottombar bg-gray-800 text-white py-0.5">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <span className="font-bold">[HOT] </span>
          <span>Coolmate Active for Women chân thực ra mắt - </span>
          <a href="#" className="hover:underline">
            Khám phá ngay →
          </a>
        </div>
      </div>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      // Không cần truyền prop onLoginSuccess nữa vì đã dùng event
      />
    </div>
  );
};

export default NavBar;