import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import productService from "../services/ProductService"; // Đường dẫn đến ProductService

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProducts();
  }, []);
  console.log('Fetched products11:', products); // Log để kiểm tra dữ liệu

  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  if (!products.length) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-[90%] mx-auto py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
    </div>
  );
};

export default AllProduct;