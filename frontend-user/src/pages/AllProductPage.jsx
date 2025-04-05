import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AllProduct from "../components/AllProduct";
import productService from "../services/ProductService"; // Đường dẫn tới service

const AllProductPage = () => {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
        const productList = await productService.getAllProducts();
        setProducts(productList);

    };
    fetchProducts();
  }, []);


  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {/* Phần tiêu đề và tab lọc */}
      <div className="pt-10 flex-grow">
        <div className="max-w-[90%] mx-auto">
          <h2 className="text-4xl font-extralight mb-4">TẤT CẢ SẢN PHẨM</h2>
          <div className="flex space-x-4 mb-4">
            <button className="px-4 h-12 py-2 bg-blue-500 text-white rounded-full min-w-[100px]">
              Tất cả
            </button>
            <button className="px-4 h-12 py-2 bg-gray-200 text-gray-700 rounded-full min-w-[100px]">
              Áo
            </button>
            <button className="px-4 h-12 py-2 bg-gray-200 text-gray-700 rounded-full min-w-[100px]">
              Quần
            </button>
            <button className="px-4 h-12 py-2 bg-gray-200 text-gray-700 rounded-full min-w-[100px]">
              Quần lót
            </button>
            <button className="px-4 h-12 py-2 bg-gray-200 text-gray-700 rounded-full min-w-[100px]">
              Phụ kiện
            </button>
          </div>
        </div>
        {/* Danh sách sản phẩm */}
        <div className="max-w-[90%] mx-auto py-8">
          <AllProduct products={products} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllProductPage;