import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import productService from "../services/ProductService"; // Đường dẫn đến ProductService

const ListProductScroll = () => {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  // Gọi API để lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Hàm xử lý cuộn
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  // Xử lý trạng thái loading và error
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;
  if (!products.length) return <div className="text-center py-10">Không có sản phẩm</div>;

  return (
    <div className="container mx-auto">
      {/* Product List with Scroll */}
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-15 top-50 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-200"
        >
          ←
        </button>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id} // Sử dụng product.id làm key
              id={product.id} // Truyền id cho ProductCard
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
        <button
          onClick={() => scroll("right")}
          className="absolute -right-15 top-50 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-200"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default ListProductScroll;