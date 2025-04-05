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
};

export default productService;