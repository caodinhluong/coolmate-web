import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Thay bằng URL API thực tế của bạn

export class OrderService {
    // Lấy danh sách đơn hàng đang chờ xử lý
    async getPendingOrders() {
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/pending`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng đang chờ xử lý:', error);
            // Ném lỗi ra ngoài để component có thể xử lý (ví dụ: hiển thị toast)
            throw error; 
        }
    }

    // Lấy danh sách đơn hàng không chờ xử lý
    async getNonPendingOrders() {
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/non-pending`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng không chờ xử lý:', error);
            throw error;
        }
    }

    // Lấy thông tin sản phẩm bằng ID
    async getProductById(productId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            throw error;
        }
    }

    // Lấy chi tiết đơn hàng bằng Order ID
    async getOrderDetails(orderId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/order-details/order/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            throw error;
        }
    }
    
    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(orderId, status) {
        try {
            const response = await axios.put(`${API_BASE_URL}/orders/status/${orderId}`, { status });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
            throw error;
        }
    }

    // =================================================================
    // ==========> CÁC HÀM API THỐNG KÊ MỚI <==========
    // =================================================================

    /**
     * 1. Lấy dữ liệu doanh thu theo tháng của một năm
     * @param {number} year - Năm cần thống kê (ví dụ: 2024)
     * @returns {Promise<Array<{month: number, revenue: number}>>} - Mảng 12 tháng và doanh thu tương ứng
     */
    async getMonthlyRevenue(year) {
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/monthly-revenue`, {
                params: { year } // Gửi 'year' dưới dạng query parameter
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy doanh thu theo tháng:', error);
            throw error;
        }
    }

    /**
     * 2. Lấy danh sách sản phẩm bán chạy nhất
     * @param {object} options - Tùy chọn { limit, startDate, endDate }
     * @returns {Promise<Array<object>>} - Mảng các sản phẩm bán chạy
     */
    async getBestSellingProducts(options = {}) {
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/best-selling`, {
                params: options // Gửi các options làm query parameters
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm bán chạy:', error);
            throw error;
        }
    }

    /**
     * 3. Lấy danh sách các sản phẩm đã được bán
     * @param {object} options - Tùy chọn { startDate, endDate }
     * @returns {Promise<Array<object>>} - Mảng các sản phẩm đã bán
     */
    async getSoldProductsList(options = {}) {
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/sold-products-list`, {
                params: options
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm đã bán:', error);
            throw error;
        }
    }

    /**
     * 4. Lấy các chỉ số thống kê tổng quan
     * @returns {Promise<{total_revenue: number, total_orders: number, total_products_sold: number}>}
     */
    async getOverviewStats() {
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/overview`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy thống kê tổng quan:', error);
            throw error;
        }
    }
}