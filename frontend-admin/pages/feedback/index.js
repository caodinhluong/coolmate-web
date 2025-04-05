import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { FeedbackService } from '../../demo/service/FeedbackService';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const feedbackService = new FeedbackService();

    useEffect(() => {
        feedbackService.getFeedbacks()
            .then((data) => {
                console.log('Danh sách phản hồi:', data);
                setFeedbacks(data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách phản hồi:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách phản hồi', life: 3000 });
            });
    }, []);

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return (
            <Button label="Xuất CSV" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        );
    };

    const sttBodyTemplate = (rowData, { rowIndex }) => {
        return (
            <>
                <span className="p-column-title">STT</span>
                {rowIndex + 1}
            </>
        );
    };

    const productBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Sản phẩm</span>
                {rowData.product_id || 'Không có'}
            </>
        );
    };

    const userBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Người dùng</span>
                {rowData.user_id || 'Không có'}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Đánh giá</span>
                <Rating value={rowData.rating || 0} readOnly cancel={false} />
            </>
        );
    };

    const messageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Bình luận</span>
                {rowData.message || 'Không có'}
            </>
        );
    };

    const createAtBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ngày tạo</span>
                {rowData.create_at ? new Date(rowData.create_at).toLocaleString('vi-VN') : 'Không có'}
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Quản lý phản hồi</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={feedbacks}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} phản hồi"
                        globalFilter={globalFilter}
                        emptyMessage="Không tìm thấy phản hồi."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column header="STT" sortable body={sttBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="product_id" header="Sản phẩm" sortable body={productBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="user_id" header="Người dùng" sortable body={userBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="rating" header="Đánh giá" sortable body={ratingBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="message" header="Bình luận" body={messageBodyTemplate} headerStyle={{ minWidth: '20rem' }}></Column>
                        <Column field="create_at" header="Ngày tạo" sortable body={createAtBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Feedback;