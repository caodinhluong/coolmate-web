import React, { useState, useEffect } from 'react'; // Combine useState and useEffect here
import { FiSearch } from 'react-icons/fi';
import { Link } from "react-router-dom";
import LoginModal from './LoginModal'; 
import '../styles/_navbar.scss';
import '../styles/index.css';
import iconCart from '../assets/icon-cart-new-v2.svg';

const NavBar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false); // State to control modal visibility
  const [cartCount, setCartCount] = useState(0);

  // Function to open the modal
  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Đếm số lượng sản phẩm khác nhau (số phần tử trong mảng cart)
    const uniqueItems = cart.length;
    setCartCount(uniqueItems);
  }, []);

  return (
    <div className="navbar flex flex-col">
      {/* Topbar */}
      <div className="topbar border-b border-gray-300">
        <div className="container mx-auto px-4 py-1.5 flex justify-between items-center">
          <ul className="flex">
            <li>
              <span className="font-bold">VÉ COOLMATE</span>
            </li>
            <li>
              <span className="divider mx-2 font-thin">|</span>
              <span className="font-bold">84RISING*</span>
            </li>
            <li>
              <span className="divider mx-2 font-thin">|</span>
              <span className="font-bold">COOLXPRINT</span>
            </li>
          </ul>
          <ul className="flex">
            <li>
              <span className="font-extrabold">CoolClub</span>
            </li>
            <li>
              <span className="divider mx-2 font-thin">|</span>
              <span className="font-extrabold">Blog</span>
            </li>
            <li>
              <span className="divider mx-2 font-thin">|</span>
              <span className="font-extrabold">Trung tâm CSKH</span>
            </li>
            <li>
              <span className="divider mx-2 font-thin">|</span>
              <span
                className="font-extrabold cursor-pointer"
                onClick={handleOpenLogin} // Trigger modal on click
              >
                Đăng nhập
              </span>
            </li>
          </ul>
        </div>
      </div>
      {/* Header */}
      <div className="header bg-white border-b border-gray-200">
        <div className="container mx-auto px-2 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img src="/logo.png" className="w-[100px] cursor-pointer" alt="Logo" />
            </Link>
          </div>
          {/* Categories */}
          <div className="flex space-x-4">
            <Link to="/nam-navbar" className="mx-5 text-black-700 font-bold hover:text-black cursor-pointer">
              NAM
            </Link>
            <Link to="/nu-navbar" className="mx-5 text-black-700 font-bold hover:text-black cursor-pointer">
              NỮ
            </Link>
            <Link to="/all-product" className="mx-5 text-black-700 font-bold hover:text-black cursor-pointer">
              THỂ THAO
            </Link>
            <Link to="/care-share" className="mx-5 text-black-700 font-bold hover:text-black cursor-pointer">
              CARE & SHARE
            </Link>
          </div>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="border border-neutral-400 rounded-4xl py-1 px-2 w-60 h-12 [&::placeholder]:text-sm"
              />
              
            </div>
            <span
              className="text-black-500 cursor-pointer text-2xl"
              onClick={handleOpenLogin} // Trigger modal on click
            >
              <i className="fas fa-user"></i>
            </span>
            {/* Biểu tượng giỏ hàng với Link điều hướng */}
            <Link to="/cart" className="relative cursor-pointer text-2xl">
              <img src={iconCart} alt="Cart" className="w-6 h-6 mb-1" />
              <span className="absolute -bottom-1 -right-1.5 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
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
      />
    </div>
  );
};

export default NavBar;