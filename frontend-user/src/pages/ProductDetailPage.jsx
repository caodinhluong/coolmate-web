import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import productService from "../services/ProductService";

// Icon giỏ hàng
import { FaShoppingCart, FaShareAlt } from "react-icons/fa";
// Hàm định dạng giá: thêm dấu chấm cứ mỗi 3 chữ số
const formatPrice = (price) => {
  if (typeof price !== "number") {
    price = Number(price) || 0;
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const ProductDetailPage = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null); // State để lưu ảnh chính hiện tại
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [selectedColor, setSelectedColor] = useState(null); // State để lưu màu được chọn
  const [selectedSize, setSelectedSize] = useState(null); // State để lưu kích thước được chọn
  const [quantity, setQuantity] = useState(1); // State để lưu số lượng

  // Dữ liệu tĩnh cho sizes
  const staticSizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        console.log("Fetched product:", data);
        setProduct(data);
        // Đặt ảnh chính ban đầu là ảnh đầu tiên trong imageUrls
        if (data && data.imageUrls && data.imageUrls.length > 0) {
          setMainImage(data.imageUrls[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Đặt màu và kích thước mặc định khi product được tải
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (staticSizes && staticSizes.length > 0) {
      setSelectedSize(staticSizes[0]);
    }
  }, [product]);

  // Hàm xử lý khi click vào ảnh phụ
  const handleThumbnailClick = (img) => {
    setMainImage(img); // Cập nhật ảnh chính
  };

  // Hàm xử lý khi click vào màu
  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  // Hàm xử lý khi click vào kích thước
  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  // Hàm xử lý tăng/giảm số lượng
  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change)); // Không cho số lượng nhỏ hơn 1
  };
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Vui lòng chọn màu sắc và kích thước trước khi thêm vào giỏ hàng!");
      return;
    }

    // Tạo object sản phẩm để thêm vào giỏ hàng
    const cartItem = {
      id: product.id,
      name: product.name,
      description: product.description || "Không có mô tả",
      color: selectedColor.name,
      size: selectedSize,
      quantity: quantity,
      price: product.price,
      originalPrice: product.discount || product.price,
      image: product.imageUrls[0], // Lấy ảnh đầu tiên làm ảnh đại diện
    };

    // Lấy giỏ hàng hiện tại từ localStorage (nếu có)
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa (dựa trên id, color, size)
    const existingItemIndex = existingCart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.color === cartItem.color &&
        item.size === cartItem.size
    );

    if (existingItemIndex !== -1) {
      // Nếu sản phẩm đã có, tăng số lượng
      existingCart[existingItemIndex].quantity += cartItem.quantity;
    } else {
      // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
      existingCart.push(cartItem);
    }

    // Lưu giỏ hàng mới vào localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Thông báo cho người dùng
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };
  // Dữ liệu breadcrumb (có thể lấy từ API hoặc định nghĩa tĩnh)
  const breadcrumb = [
    { name: "Trang chủ", link: "/" },
    { name: "Đồ Nam", link: "/do-nam" },
    { name: "Áo Nam", link: "/ao-nam" },
    { name: "Áo Sơ Mi Nam", link: "/ao-so-mi-nam" },
  ];

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;
  if (!product) return <div className="text-center py-10">Sản phẩm không tồn tại</div>;

  // Tính phần trăm giảm giá (nếu có)
  const discountPercentage =
    product.discount > 0
      ? Math.round(((product.discount - product.price) / product.discount) * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col">
    <NavBar />

    {/* Phần Breadcrumb */}
    <div className="container mx-auto px-4 py-4">
      <nav className="text-gray-600 text-sm">
        {breadcrumb.map((item, index) => (
          <span key={index}>
            {index > 0 && " / "}
            {item.link ? (
              <a href={item.link} className="hover:text-blue-600 hover:underline">
                {item.name}
              </a>
            ) : (
              <span>{item.name}</span>
            )}
          </span>
        ))}
      </nav>
    </div>

    <div className="max-w-[80%] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Phần hình ảnh */}
      <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-4">
        {/* Danh sách ảnh phụ */}
        <div className="w-1/11 h-10 flex flex-col gap-2">
          {product.imageUrls.map((img, index) => (
            <img
              key={index}
              src={`/product/${img}`}
              alt={`${product.name} - ${index + 1}`}
              className={`w-full h-24 object-cover border rounded cursor-pointer hover:opacity-75 ${
                mainImage === img ? "border-blue-500 opacity-100" : "border-gray-300"
              }`}
              onClick={() => handleThumbnailClick(img)}
            />
          ))}
        </div>
        {/* Ảnh chính */}
        <div className="w-full lg:w-4/5">
          <img
            src={`/product/${mainImage}`}
            alt={product.name}
            className="w-full h-auto object-cover rounded"
          />
        </div>
      </div>

      {/* Phần thông tin sản phẩm */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-6xl font-bold mb-2">{product.name}</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-yellow-400">★★★★☆</span>
          <span className="text-gray-600">
            ({product.rating} - {product.ratingCount} đánh giá)
          </span>
          <span className="text-blue-600 ml-4 flex items-center gap-1 cursor-pointer">
            <FaShareAlt className="text-sm" />
            Chia sẻ
          </span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-bold text-black-600">
            {formatPrice(product.price)}
          </span>
          {product.discount > 0 && (
            <span className="text-gray-500 line-through">
              {formatPrice(product.discount)}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="text-white bg-blue-700 px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>
        <p className="text-green-600 mb-4">Freeship</p>

        {/* Màu sắc */}
        <div className="mb-4">
          <p className="font-semibold text-sm">
            Màu sắc: {selectedColor ? selectedColor.name : "Chưa chọn"}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className={`w-20 h-10 rounded-full border cursor-pointer p-0.5 ${
                  selectedColor === color ? "border-blue-500 border-2" : "border-gray-300"
                }`}
                onClick={() => handleColorClick(color)}
                title={color.name} // Hiển thị tên màu khi hover
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: color.value }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Kích thước */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Kích thước áo:</p>
            <p className="text-blue-600 text-sm underline cursor-pointer">
              Hướng dẫn chọn size
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {staticSizes.map((size, index) => (
              <button
                key={index}
                className={`w-20 h-10 border rounded-full text-center mr-2 text-sm font-medium ${
                  selectedSize === size
                    ? "border-black border-2 text-black"
                    : "border-gray-500 text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleSizeClick(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Nút mua hàng và Số lượng */}
        <div className="mt-6 relative rounded-full">
          {/* Số lượng - Đặt absolute ở góc trái của nút "Thêm vào giỏ hàng" */}
          <div className="h-full w-27 absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center gap-1 bg-black border border-gray-300 rounded-full px-2 py-1 shadow-sm">
            <button
              className="w-10 h-10 rounded-full text-white text-center text-xl font-medium hover:bg-black cursor-pointer"
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <span className="text-lg text-white font-medium px-1">{quantity}</span>
            <button
              className="w-10 h-10 text-white rounded-full text-center text-xl font-medium hover:bg-black cursor-pointer"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>

          {/* Nút mua hàng */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-full"
            >
              <FaShoppingCart />
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>

  );
};

export default ProductDetailPage;