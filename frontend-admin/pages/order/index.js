import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { OrderService } from '../../demo/service/OrderService';
import { ProgressSpinner } from 'primereact/progressspinner';

const Order = () => {
    const emptyOrder = {
        order_id: null,
        status: '',
        order_date: '',
        payment_method: '',
        voucher_id: null,
        total_amount: 0,
        address: '',
        customer_name: '',
        phone: '',
        order_details: []
    };

    const [orders, setOrders] = useState([]);
    const [orderDialog, setOrderDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(emptyOrder);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [showPending, setShowPending] = useState(true);
    const toast = useRef(null);
    const dt = useRef(null);
    const orderService = new OrderService();

    useEffect(() => {
        fetchOrders();
    }, [showPending]);

    const fetchOrders = () => {
        const fetchMethod = showPending ? orderService.getPendingOrders : orderService.getNonPendingOrders;
        fetchMethod()
            .then((data) => {
                setOrders(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách đơn hàng:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách đơn hàng', life: 3000 });
            });
    };

    // =================================================================
    // ==========> HÀM ĐÃ ĐƯỢC VIẾT LẠI VÀ SỬA LỖI <==========
    // =================================================================
    const viewOrderDetails = async (order) => {
        // Mở dialog và hiển thị thông tin cơ bản ngay lập tức
        setSelectedOrder({ ...order, order_details: [] });
        setOrderDialog(true);
        setLoadingDetails(true); // Bắt đầu tải

        try {
            // Lấy chi tiết đơn hàng (các sản phẩm)
            const rawDetails = await orderService.getOrderDetails(order.order_id);

            if (!rawDetails || rawDetails.length === 0) {
                console.log("Đơn hàng này không có chi tiết sản phẩm.");
                setSelectedOrder((prevOrder) => ({ ...prevOrder, order_details: [] })); // Cập nhật để hiển thị bảng trống
                setLoadingDetails(false);
                return;
            }

            // "Làm giàu" dữ liệu chi tiết với thông tin sản phẩm (tên, ảnh, ...)
            const enrichedDetails = await Promise.all(
                rawDetails.map(async (detail) => {
                    try {
                        // Lấy thông tin của từng sản phẩm
                        const productResponse = await orderService.getProductById(detail.product_id);

                        // *** ĐIỂM SỬA LỖI CHÍNH ***
                        // Kiểm tra xem API trả về mảng hay không. Nếu có, lấy phần tử đầu tiên.
                        const product = Array.isArray(productResponse) && productResponse.length > 0 ? productResponse[0] : productResponse;

                        if (product) { // Kiểm tra xem product có tồn tại không
                            const firstImage = product.image_url ? product.image_url.split(',')[0].trim() : null;
                            
                            return {
                                ...detail, // Giữ lại các thông tin gốc của chi tiết đơn hàng
                                name: product.name || 'Không có tên',
                                image_url: firstImage ? `/product/${firstImage}` : '/images/placeholder.jpg',
                                size: detail.size || 'N/A'
                            };
                        } else {
                            // Trường hợp API trả về null/undefined cho một product_id nào đó
                            throw new Error(`Không tìm thấy sản phẩm với ID: ${detail.product_id}`);
                        }
                    } catch (error) {
                        // Nếu lỗi khi lấy 1 sản phẩm, vẫn hiển thị các sản phẩm khác
                        console.error(`Lỗi khi lấy sản phẩm ${detail.product_id}:`, error);
                        return {
                            ...detail,
                            name: 'Lỗi tải sản phẩm',
                            image_url: '/images/placeholder.jpg', // Ảnh mặc định khi lỗi
                            size: detail.size || 'N/A'
                        };
                    }
                })
            );

            // Cập nhật lại state với chi tiết đã được làm giàu
            setSelectedOrder((prevOrder) => ({ ...prevOrder, order_details: enrichedDetails }));
        } catch (error) {
            // Lỗi này thường xảy ra nếu `getOrderDetails` thất bại
            console.error('Lỗi nghiêm trọng khi lấy chi tiết đơn hàng:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải chi tiết đơn hàng', life: 3000 });
        } finally {
            setLoadingDetails(false); // Kết thúc tải
        }
    };

    const hideDialog = () => {
        setOrderDialog(false);
        setSelectedOrder(emptyOrder);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật trạng thái đơn hàng thành công', life: 3000 });
            fetchOrders();
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật trạng thái đơn hàng', life: 3000 });
        }
    };

    const toggleOrderList = () => {
        setShowPending(!showPending);
    };

    const leftToolbarTemplate = () => <div className="my-2"> <Button label={showPending ? 'Xem Đã xử lý' : 'Xem Chờ xử lý'} icon="pi pi-filter" severity="info" onClick={toggleOrderList} /> </div>;
    const rightToolbarTemplate = () => <Button label="Xuất CSV" icon="pi pi-upload" severity="help" onClick={() => dt.current.exportCSV()} />;
    const sttBodyTemplate = (rowData, { rowIndex }) => rowIndex + 1;
    const customerNameBodyTemplate = (rowData) => rowData.customer_name;
    const totalAmountBodyTemplate = (rowData) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rowData.total_amount);
    const orderDateBodyTemplate = (rowData) => new Date(rowData.order_date).toLocaleString('vi-VN');
    const paymentMethodBodyTemplate = (rowData) => rowData.payment_method;
    const statusBodyTemplate = (rowData) => {
        const statusOptions = [
            { label: 'Đang chờ xử lý', value: 'pending' },
            { label: 'Đã xác nhận', value: 'confirmed' },
            { label: 'Đang giao hàng', value: 'shipping' },
            { label: 'Đã hoàn thành', value: 'completed' },
            { label: 'Đã hủy', value: 'cancelled' }
        ];
        return <Dropdown value={rowData.status} options={statusOptions} onChange={(e) => updateOrderStatus(rowData.order_id, e.value)} placeholder="Chọn trạng thái" style={{ width: '150px' }} />;
    };
    const actionBodyTemplate = (rowData) => <Button icon="pi pi-eye" severity="info" rounded onClick={() => viewOrderDetails(rowData)} tooltip="Xem chi tiết" tooltipOptions={{ position: 'top' }} />;
    const imageBodyTemplate = (rowData) => (
        <img
            src={rowData.image_url || '/images/placeholder.jpg'}
            alt={rowData.name || 'Sản phẩm'}
            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
            onError={(e) => {
                if (e.target.src !== '/images/placeholder.jpg') {
                    e.target.src = '/images/placeholder.jpg';
                }
            }}
        />
    );
    const header = ( <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center"> <h5 className="m-0">Quản lý đơn hàng</h5> <span className="block mt-2 md:mt-0 p-input-icon-left"> <i className="pi pi-search" /> <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." /> </span> </div> );
    const orderDialogFooter = <Button label="Đóng" icon="pi pi-times" text onClick={hideDialog} />;

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={orders} dataKey="order_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} đơn hàng" globalFilter={globalFilter} emptyMessage="Không tìm thấy đơn hàng." header={header} responsiveLayout="scroll">
                        <Column header="STT" body={sttBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="customer_name" header="Tên khách hàng" sortable body={customerNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="total_amount" header="Tổng tiền" sortable body={totalAmountBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="order_date" header="Ngày đặt" sortable body={orderDateBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="payment_method" header="Phương thức thanh toán" sortable body={paymentMethodBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column header="Trạng thái" body={statusBodyTemplate} headerStyle={{ minWidth: '14rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                    </DataTable>

                    <Dialog visible={orderDialog} style={{ width: '800px' }} header="Chi tiết đơn hàng" modal className="p-fluid" footer={orderDialogFooter} onHide={hideDialog}>
                        <div className="field"> <label>Mã đơn hàng</label> <InputText value={selectedOrder.order_id} disabled /> </div>
                        <div className="field"> <label>Tên khách hàng</label> <InputText value={selectedOrder.customer_name} disabled /> </div>
                        <div className="field"> <label>Địa chỉ</label> <InputText value={selectedOrder.address} disabled /> </div>
                        <div className="field"> <label>Số điện thoại</label> <InputText value={selectedOrder.phone} disabled /> </div>
                        <div className="field"> <label>Tổng tiền</label> <InputText value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.total_amount)} disabled /> </div>
                        <div className="field"> <label>Phương thức thanh toán</label> <InputText value={selectedOrder.payment_method} disabled /> </div>
                        <div className="field"> <label>Thời gian đặt hàng</label> <InputText value={new Date(selectedOrder.order_date).toLocaleString('vi-VN')} disabled /> </div>
                        <div className="field">
                            <label>Chi tiết sản phẩm</label>
                            {loadingDetails ? (
                                <div className="flex justify-content-center p-4">
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" />
                                </div>
                            ) : (
                                <DataTable value={selectedOrder.order_details || []} responsiveLayout="scroll" emptyMessage="Không có sản phẩm nào.">
                                    <Column header="Ảnh" body={imageBodyTemplate} />
                                    <Column field="name" header="Tên sản phẩm" />
                                    <Column field="product_id" header="Mã sản phẩm" />
                                    <Column field="quantity" header="Số lượng" />
                                    <Column field="price" header="Giá" body={(rowData) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rowData.price)} />
                                    <Column field="size" header="Kích cỡ" body={(rowData) => rowData.size || 'N/A'} />
                                </DataTable>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Order;