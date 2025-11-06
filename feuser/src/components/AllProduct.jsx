// src/pages/AllProduct.js (Sửa lại file cũ)

import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductSidebar from "../components/ProductSidebar"; // <-- Import sidebar
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Dropdown } from 'primereact/dropdown';
import productService from "../services/ProductService"; 

const AllProduct = () => {
    const [allProducts, setAllProducts] = useState([]); // Danh sách sản phẩm gốc
    const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách đã lọc
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // State cho sắp xếp
    const [sortKey, setSortKey] = useState(null);
    const sortOptions = [
        { label: 'Bán chạy', value: 'best-selling' },
        { label: 'Giá tăng dần', value: 'price-asc' },
        { label: 'Giá giảm dần', value: 'price-desc' },
        { label: 'Sản phẩm mới', value: 'newest' },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setAllProducts(data);
                setFilteredProducts(data); // Ban đầu hiển thị tất cả
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    
    // Hàm xử lý khi bộ lọc từ sidebar thay đổi
    const handleFilterChange = (filters) => {
        console.log("Applying filters:", filters);
        // Ở đây bạn sẽ viết logic để lọc `allProducts` dựa trên `filters`
        // Ví dụ đơn giản:
        let products = [...allProducts];
        if (filters.categories && filters.categories.length > 0) {
            // Logic lọc theo category name (cần điều chỉnh cho phù hợp với dữ liệu thực tế)
            // products = products.filter(p => filters.categories.includes(p.category.toLowerCase()));
        }
        setFilteredProducts(products);
    };

    // Hàm sắp xếp
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
            // Thêm logic cho 'best-selling' và 'newest' nếu có dữ liệu tương ứng
            default:
                break;
        }
        setFilteredProducts(sortedProducts);
    }

    const breadcrumb = [
        { name: "Trang chủ", link: "/" },
        { name: "Tất cả sản phẩm", link: "/all-product" },
    ];

    return (
        <div className="bg-white">
          

            <div className="max-w-[90%] mx-auto py-6">
                {/* Breadcrumb và Tiêu đề */}
                <div className="mb-4">
                    <nav className="text-gray-500 text-sm">
                        {breadcrumb.map((item, index) => (
                            <span key={index}>
                                {index > 0 && <span className="mx-2">/</span>}
                                <a href={item.link} className="hover:text-black">{item.name}</a>
                            </span>
                        ))}
                    </nav>
                    <h2 className="text-4xl font-extrabold mt-2">TẤT CẢ SẢN PHẨM</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Cột Trái: Sidebar */}
                    <div className="w-full md:w-1/4 lg:w-1/5">
                        <ProductSidebar onFilterChange={handleFilterChange} />
                    </div>

                    {/* Cột Phải: Sản phẩm */}
                    <div className="w-full md:w-3/4 lg:w-4/5">
                        {/* Thanh sắp xếp */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-700">{filteredProducts.length} kết quả</span>
                             <div className="flex items-center">
                                <span className="mr-2 text-gray-500 text-sm font-semibold">SẮP XẾP THEO</span>
                                <Dropdown value={sortKey} options={sortOptions} onChange={onSortChange} placeholder="Bán chạy" className="w-48" />
                            </div>
                        </div>

                        {/* Lưới sản phẩm */}
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

        </div>
    );
};

export default AllProduct;