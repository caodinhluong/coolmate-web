// src/components/Dashboard.js

import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { OrderService } from '../../demo/service/OrderService'; // Điều chỉnh đường dẫn nếu cần
import { ProductService } from '../../demo/service/ProductService'; // Lấy thêm thông tin sản phẩm
import { ProgressSpinner } from 'primereact/progressspinner';

const Dashboard = () => {
    const [overview, setOverview] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState(null);
    const [bestSellers, setBestSellers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const orderService = new OrderService();
    const productService = new ProductService(); // Giả sử bạn có service này

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const year = new Date().getFullYear();

                const [overviewData, monthlyRevenueData, bestSellersData, nonPendingOrders] = await Promise.all([
                    orderService.getOverviewStats(),
                    orderService.getMonthlyRevenue(year),
                    orderService.getBestSellingProducts({ limit: 5 }),
                    orderService.getNonPendingOrders() // Lấy các đơn hàng gần đây
                ]);

                setOverview(overviewData);
                
                // Chuẩn bị dữ liệu cho biểu đồ doanh thu
                const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
                const data = monthlyRevenueData.map(item => item.revenue);
                setMonthlyRevenue({
                    labels,
                    datasets: [
                        {
                            label: `Doanh thu năm ${year}`,
                            data: data,
                            fill: false,
                            borderColor: '#42A5F5',
                            tension: 0.4
                        }
                    ]
                });

                // Tính toán phần trăm cho sản phẩm bán chạy
                const totalSold = bestSellersData.reduce((sum, p) => sum + p.total_quantity_sold, 0);
                const bestSellersWithPercentage = bestSellersData.map(p => ({
                    ...p,
                    percentage: totalSold > 0 ? ((p.total_quantity_sold / totalSold) * 100).toFixed(0) : 0
                }));
                setBestSellers(bestSellersWithPercentage);

                // Lấy 5 đơn hàng gần đây nhất để hiển thị
                setRecentOrders(nonPendingOrders.slice(0, 5));

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu dashboard:", error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu thống kê', life: 3000 });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (value) => {
        return (value || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#495057' },
                grid: { color: '#ebedef' }
            },
            y: {
                ticks: { color: '#495057' },
                grid: { color: '#ebedef' }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="grid">
            <Toast ref={toast} />

            {/* Các thẻ thống kê tổng quan */}
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Đơn hàng</span>
                            <div className="text-900 font-medium text-xl">{overview?.total_orders || 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Tổng số </span>
                    <span className="text-500">đơn đã giao</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Doanh thu</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(overview?.total_revenue)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Tổng doanh thu </span>
                    <span className="text-500">từ các đơn đã giao</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Sản phẩm đã bán</span>
                            <div className="text-900 font-medium text-xl">{overview?.total_products_sold || 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-box text-cyan-500 text-xl"></i>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Tổng số lượng </span>
                    <span className="text-500">sản phẩm đã bán</span>
                </div>
            </div>
            
            <div className="col-12 lg:col-6 xl:col-3">
                 <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Bán chạy</span>
                            <div className="text-900 font-medium text-xl truncate" style={{maxWidth: '150px'}} title={bestSellers[0]?.name || 'N/A'}>
                                {bestSellers[0]?.name || 'N/A'}
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-star-fill text-purple-500 text-xl"></i>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Sản phẩm </span>
                    <span className="text-500">bán chạy nhất</span>
                </div>
            </div>


            {/* Biểu đồ và danh sách */}
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Đơn hàng gần đây</h5>
                    <DataTable value={recentOrders} rows={5} paginator responsiveLayout="scroll" emptyMessage="Không có đơn hàng nào">
                        <Column field="order_id" header="Mã ĐH" sortable style={{ width: '25%' }} />
                        <Column field="customer_name" header="Khách hàng" sortable style={{ width: '40%' }} />
                        <Column field="total_amount" header="Tổng tiền" sortable body={(rowData) => formatCurrency(rowData.total_amount)} style={{ width: '35%' }} />
                    </DataTable>
                </div>
                <div className="card">
                    <h5>Sản phẩm bán chạy</h5>
                    {bestSellers.length > 0 ? (
                        <ul className="list-none p-0 m-0">
                            {bestSellers.map(p => (
                                <li key={p.product_id} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                    <div>
                                        <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{p.name}</span>
                                        <div className="mt-1 text-600">Đã bán: {p.total_quantity_sold}</div>
                                    </div>
                                    <div className="mt-2 md:mt-0 flex align-items-center">
                                        <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                            <div className="bg-orange-500 h-full" style={{ width: `${p.percentage}%` }}></div>
                                        </div>
                                        <span className="text-orange-500 ml-3 font-medium">% {p.percentage}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có dữ liệu.</p>
                    )}
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Tổng quan doanh thu</h5>
                    {monthlyRevenue ? <Chart type="line" data={monthlyRevenue} options={chartOptions} /> : <p>Đang tải biểu đồ...</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;