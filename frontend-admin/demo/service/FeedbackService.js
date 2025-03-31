const API_BASE_URL = 'http://localhost:3001'; // Thay bằng URL API thực tế của bạn

export class FeedbackService {
    // Lấy danh sách feedback
    async getFeedbacks() {
        try {
            const response = await fetch(`${API_BASE_URL}/feedbacks`);
            if (!response.ok) throw new Error('Không thể lấy danh sách feedback');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách feedback:', error);
            throw error;
        }
    }

    // Tạo feedback mới
    async createFeedback(feedback) {
        try {
            console.log('Dữ liệu gửi lên:', feedback); // Debug
            const response = await fetch(`${API_BASE_URL}/feedbacks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedback),
            });
            if (!response.ok) throw new Error('Không thể tạo feedback');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi tạo feedback:', error);
            throw error;
        }
    }

    // Cập nhật feedback
    async updateFeedback(feedback) {
        try {
            const response = await fetch(`${API_BASE_URL}/feedbacks/${feedback.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedback),
            });
            if (!response.ok) throw new Error('Không thể cập nhật feedback');
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi cập nhật feedback:', error);
            throw error;
        }
    }

    // Xóa feedback
    async deleteFeedback(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/feedbacks/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Không thể xóa feedback với ID: ${id}`);
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa feedback:', error);
            throw error;
        }
    }
}