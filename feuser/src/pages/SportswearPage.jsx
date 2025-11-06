// src/pages/SportswearPage.js

import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductSidebar from "../components/ProductSidebar";
import NavBar from "../components/NavBar"; // Giả định bạn có NavBar và Footer
import Footer from "../components/Footer";
import { Dropdown } from 'primereact/dropdown';
import productService from "../services/ProductService"; 

// ===== ĐỔI TÊN COMPONENT =====
const SportswearPage = () => { 
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [sortKey, setSortKey] = useState(null);
    const sortOptions = [
        { label: 'Bán chạy', value: 'best-selling' },
        { label: 'Giá tăng dần', value: 'price-asc' },
        { label: 'Giá giảm dần', value: 'price-desc' },
        { label: 'Sản phẩm mới', value: 'newest' },
    ];

    // ===== THAY ĐỔI LỚN NHẤT Ở ĐÂY =====
    useEffect(() => {
        const fetchSportswearProducts = async () => {
            try {
                setLoading(true);
                // GIả sử ID của danh mục "Thể thao" là 3.
                // BẠN CẦN THAY SỐ 3 BẰNG ID ĐÚNG TRONG DATABASE CỦA BẠN.
                const sportswearCategoryID = 8; 
                const data = await productService.getProductsByCategoryId(sportswearCategoryID);
                
                setAllProducts(data);
                setFilteredProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSportswearProducts();
    }, []); // useEffect này chỉ chạy một lần khi component được mount
    
    // Các hàm handleFilterChange và onSortChange giữ nguyên logic
    const handleFilterChange = (filters) => {
        console.log("Applying filters:", filters);
        let products = [...allProducts];
        // Bạn có thể thêm logic lọc chi tiết hơn ở đây nếu cần
        setFilteredProducts(products);
    };

    const onSortChange = (e) => {
        const value = e.value;
        setSortKey(value);
        let sortedProducts = [...filteredProducts];
        switch (value) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }
        setFilteredProducts(sortedProducts);
    }

    // ===== CẬP NHẬT BREADCRUMB VÀ TIÊU ĐỀ =====
    const breadcrumb = [
        { name: "Trang chủ", link: "/" },
        { name: "Đồ thể thao", link: "/sportswear" }, // Sửa link và tên
    ];

    return (
        <div className="bg-white">
            {/* NavBar và Footer có thể được đặt ở đây hoặc trong App.js */}
            <NavBar></NavBar>

            <div className="max-w-[90%] mx-auto py-6">
                <div className="mb-4">
                    <nav className="text-gray-500 text-sm">
                        {breadcrumb.map((item, index) => (
                            <span key={index}>
                                {index > 0 && <span className="mx-2">/</span>}
                                <a href={item.link} className="hover:text-black">{item.name}</a>
                            </span>
                        ))}
                    </nav>
                    {/* Sửa tiêu đề */}
                    <h2 className="text-4xl font-extrabold mt-2">ĐỒ THỂ THAO</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/4 lg:w-1/5">
                        <ProductSidebar onFilterChange={handleFilterChange} />
                    </div>

                    <div className="w-full md:w-3/4 lg:w-4/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-700">{filteredProducts.length} kết quả</span>
                             <div className="flex items-center">
                                <span className="mr-2 text-gray-500 text-sm font-semibold">SẮP XẾP THEO</span>
                                <Dropdown value={sortKey} options={sortOptions} onChange={onSortChange} placeholder="Bán chạy" className="w-48" />
                            </div>
                        </div>

                        {loading && <div className="text-center">Đang tải sản phẩm...</div>}
                        {error && <div className="text-red-500 text-center">Lỗi: {error}</div>}
                        
                        {!loading && !error && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        imageUrls={product.imageUrls}
                                        rating={product.rating}
                                        ratingCount={product.ratingCount}
                                        name={product.name}
                                        price={product.price}
                                        discount={product.discount}
                                        colors={product.colors}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

// ===== ĐỪNG QUÊN EXPORT COMPONENT MỚI =====
export default SportswearPage; 