// src/pages/SearchResultsPage.js
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard"; // Tái sử dụng ProductCard
import productService from "../services/ProductService";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query"); // Lấy query từ URL (?query=...)

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Chỉ tìm kiếm khi có query
    if (query) {
      const fetchSearchResults = async () => {
        setLoading(true);
        setError(null);
        try {
          const results = await productService.searchProductsByName(query);
          setProducts(results);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    } else {
      // Nếu không có query, reset state
      setProducts([]);
      setLoading(false);
    }
  }, [query]); // useEffect sẽ chạy lại mỗi khi query thay đổi

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-2">Kết quả tìm kiếm</h2>
        <p className="text-gray-600 mb-6">
          {query ? `Cho từ khóa: "${query}"` : "Vui lòng nhập từ khóa để tìm kiếm."}
        </p>

        {loading && <div className="text-center">Đang tìm kiếm...</div>}
        {error && <div className="text-center text-red-500">Lỗi: {error}</div>}

        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
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
            ) : (
              <div className="text-center text-gray-500 mt-10">
                <p>Không tìm thấy sản phẩm nào phù hợp với từ khóa của bạn.</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;