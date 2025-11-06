// demo/service/SaleService.js
export class SaleService {
    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'; // Thay đổi theo API của bạn
    }

    async getSales() {
        const response = await fetch(`${this.baseUrl}/sale-promotionss`);
        if (!response.ok) throw new Error('Không thể lấy danh sách khuyến mãi');
        return response.json();
    }

    async createSale(sale) {
        const response = await fetch(`${this.baseUrl}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sale),
        });
        if (!response.ok) throw new Error('Không thể tạo khuyến mãi');
        return response.json();
    }

    async updateSale(sale) {
        const response = await fetch(`${this.baseUrl}/sales/${sale.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sale),
        });
        if (!response.ok) throw new Error('Không thể cập nhật khuyến mãi');
        return response.json();
    }

    async deleteSale(id) {
        const response = await fetch(`${this.baseUrl}/sales/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Không thể xóa khuyến mãi');
    }
}