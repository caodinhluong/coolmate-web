import api from './api';


// Class Product
class Product {
  constructor(product) {
    this.id = product.product_id || product.id || null;
    this.name = product.product_name || product.name || "Unnamed Product";
    this.mota = product.mota || "";
    this.price = Number(product.product_price || product.price) || 0;
    this.category_id = Number(product.category_id) || 1;
    this.image_url = product.image_urls || product.image_url || "default-image.jpg";
    this.title = product.title || this.name;
    this.supplier_id = Number(product.supplier_id) || 1;

    this.imageUrls = this.parseImageUrls(this.image_url);

    this.rating = Number(product.product_rating || product.rating) || 4;
    this.ratingCount = Number(product.rating_count || product.ratingCount) || 0;
    this.discount = Number(product.original_price || product.discount) || 0;

    // Map colors thành mảng các object { name, value }
    this.colors = this.mapColors(product.colors);
  }

  parseImageUrls(imageUrl) {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return ["default-image.jpg"];
    }
    const urls = imageUrl.split(',').map(url => url.trim());
    return urls.filter(url => url.length > 0).length > 0 
      ? urls.filter(url => url.length > 0)
      : ["default-image.jpg"];
  }

  // Hàm map colors thành mảng các object { name, value }
  mapColors(colors) {
    const defaultColors = [
      { name: "Đen", value: "#000000" },
      { name: "Xám Đậm", value: "#111111" },
      { name: "Xám", value: "#222222" },
      { name: "Xám Nhạt", value: "#333333" },
      { name: "Xám Sáng", value: "#444444" },
      { name: "Xám Trắng", value: "#555555" },
    ];

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return defaultColors;
    }

    // Nếu API trả về mảng mã màu, map thành mảng object
    return colors.map((color, index) => {
      const defaultColor = defaultColors[index] || { name: `Màu ${index + 1}`, value: color };
      return {
        name: defaultColor.name,
        value: color,
      };
    });
  }
}

const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      console.log("API response for getAllProducts:", response);
      
      const products = response?.data || response;
      if (!products || !Array.isArray(products)) {
        throw new Error('Invalid response format: Expected an array of products');
      }

      const mappedProducts = products.map(item => new Product(item));
      console.log("Mapped products:", mappedProducts);
      return mappedProducts;
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  },


  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      console.log("API response for getProductById:", response);
      
      let productData;
      if (response?.data !== undefined) {
        productData = response.data;
      } else {
        productData = response;
      }

      console.log("Extracted product data:", productData);

      if (Array.isArray(productData)) {
        if (productData.length === 0) {
          throw new Error(`Product with id ${id} not found`);
        }
        productData = productData[0];
      }

      if (!productData || typeof productData !== 'object' || Object.keys(productData).length === 0) {
        throw new Error(`Product with id ${id} not found or invalid data`);
      }

      const mappedProduct = new Product(productData);
      console.log("Mapped product:", mappedProduct);
      return mappedProduct;
    } catch (error) {
      throw new Error(`Failed to fetch product with id ${id}: ${error.message}`);
    }
  },
  /**
   * Lấy danh sách sản phẩm dựa trên title chính xác.
   * @param {string} title - Title của sản phẩm cần tìm.
   * @returns {Promise<Product[]>} - Mảng các sản phẩm tìm được.
   */
  getProductsByTitle: async (title) => {
    try {
      // Gọi API với query parameter
      // ví dụ: /products/search?title=MẶC HÀNG NGÀY
      const response = await api.get('/products/title', {
        params: {
          title: title,
        },
      });

      console.log(`API response for getProductsByTitle (title: ${title}):`, response);

      const products = response?.data || response;
      if (!products || !Array.isArray(products)) {
        // Nếu API trả về không phải mảng, trả về mảng rỗng để tránh lỗi
        console.warn(`Invalid response for title "${title}". Expected an array.`);
        return [];
      }

      // Map dữ liệu trả về thành các đối tượng Product
      const mappedProducts = products.map(item => new Product(item));
      console.log(`Mapped products for title "${title}":`, mappedProducts);
      return mappedProducts;

    } catch (error) {
      // Nếu API trả về lỗi 404 (không tìm thấy), axios sẽ ném ra lỗi.
      // Chúng ta sẽ bắt lỗi và trả về mảng rỗng để component hiển thị "Không có sản phẩm"
      if (error.response && error.response.status === 404) {
        return [];
      }
      // Ném ra các lỗi khác
      throw new Error(`Failed to fetch products with title "${title}": ${error.message}`);
    }
  },
   searchProductsByName: async (name) => {
    try {
      // Gọi API với query parameter: /products/search?name=tên_sản_phẩm
      const response = await api.get('/products/search', {
        params: { name }
      });

      console.log(`API response for searchProductsByName (name: ${name}):`, response);

      const products = response?.data || response;
      if (!products || !Array.isArray(products)) {
        console.warn(`Invalid search response for "${name}". Expected an array.`);
        return []; // Trả về mảng rỗng nếu không có dữ liệu hợp lệ
      }

      // Map dữ liệu trả về thành các đối tượng Product
      return products.map(item => new Product(item));

    } catch (error) {
      // Nếu có lỗi, log ra và trả về mảng rỗng để component không bị crash
      console.error(`Failed to fetch products with name "${name}":`, error.message);
      return [];
    }
  },
  getSearchSuggestions: async (query) => {
    if (!query) {
      return [];
    }
    try {
      const response = await api.get('/products/suggestions', {
        params: { q: query }
      });
      // API này chỉ trả về mảng {product_id, name}, không cần map qua class Product
      return response.data;
    } catch (error) {
      console.error("Failed to fetch search suggestions:", error.message);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  },
  /**
   * Lấy danh sách sản phẩm theo category ID.
   * @param {number} categoryId - ID của danh mục.
   * @returns {Promise<Product[]>} - Mảng các sản phẩm thuộc danh mục đó.
   */
  getProductsByCategoryId: async (categoryId) => {
    try {
      // Gọi API mới tạo: /products/category?id=...
      const response = await api.get('/products/category', {
        params: {
          category_id: categoryId,
        },
      });

      console.log(`API response for getProductsByCategoryId (ID: ${categoryId}):`, response);

      const products = response?.data || response;
      if (!products || !Array.isArray(products)) {
        console.warn(`Invalid response for categoryId "${categoryId}". Expected an array.`);
        return [];
      }

      // Map dữ liệu trả về thành các đối tượng Product
      const mappedProducts = products.map(item => new Product(item));
      console.log(`Mapped products for categoryId "${categoryId}":`, mappedProducts);
      return mappedProducts;

    } catch (error) {
      console.error(`Failed to fetch products for categoryId "${categoryId}":`, error.message);
      return []; // Trả về mảng rỗng nếu có lỗi để component không bị crash
    }
  },
};


export default productService;