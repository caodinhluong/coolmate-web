import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { SaleService } from '../../demo/service/SaleService';

const Sale = () => {
    let emptySale = {
        id: null,
        name: '',
        product_id: '',
        discount: 0,
        start_date: '',
        end_date: ''
    };

    const [sales, setSales] = useState([]);
    const [saleDialog, setSaleDialog] = useState(false);
    const [deleteSaleDialog, setDeleteSaleDialog] = useState(false);
    const [deleteSalesDialog, setDeleteSalesDialog] = useState(false);
    const [sale, setSale] = useState(emptySale);
    const [selectedSales, setSelectedSales] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const saleService = new SaleService();

    useEffect(() => {
        saleService.getSales()
            .then((data) => {
                console.log('Danh sách khuyến mãi:', data);
                setSales(data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách khuyến mãi', life: 3000 });
            });
    }, []);

    const openNew = () => {
        setSale(emptySale);
        setSubmitted(false);
        setSaleDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSaleDialog(false);
    };

    const hideDeleteSaleDialog = () => {
        setDeleteSaleDialog(false);
    };

    const hideDeleteSalesDialog = () => {
        setDeleteSalesDialog(false);
    };

    const saveSale = async () => {
        setSubmitted(true);

        if (sale.name.trim() && sale.product_id.trim() && sale.discount > 0 && sale.start_date && sale.end_date) {
            try {
                if (sale.id) {
                    console.log('Cập nhật khuyến mãi:', sale);
                    await saleService.updateSale(sale);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật khuyến mãi', life: 3000 });
                } else {
                    console.log('Tạo khuyến mãi mới:', sale);
                    const newSale = { ...sale };
                    await saleService.createSale(newSale);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo khuyến mãi', life: 3000 });
                }
                const updatedSales = await saleService.getSales();
                setSales(updatedSales);
                setSaleDialog(false);
                setSale(emptySale);
            } catch (error) {
                console.error('Lỗi khi lưu khuyến mãi:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.message || 'Không thể lưu khuyến mãi', life: 3000 });
            }
        }
    };

    const editSale = (sale) => {
        setSale({ ...sale });
        setSaleDialog(true);
    };

    const confirmDeleteSale = (sale) => {
        setSale(sale);
        setDeleteSaleDialog(true);
    };

    const deleteSale = async () => {
        try {
            console.log('Xóa khuyến mãi với ID:', sale.id);
            await saleService.deleteSale(sale.id);
            const updatedSales = await saleService.getSales();
            setSales(updatedSales);
            setDeleteSaleDialog(false);
            setSale(emptySale);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa khuyến mãi', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa khuyến mãi', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteSalesDialog(true);
    };

    const deleteSelectedSales = async () => {
        try {
            const deletePromises = selectedSales.map((s) => saleService.deleteSale(s.id));
            await Promise.all(deletePromises);
            const updatedSales = await saleService.getSales();
            setSales(updatedSales);
            setDeleteSalesDialog(false);
            setSelectedSales(null);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa các khuyến mãi đã chọn', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa nhiều khuyến mãi:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa các khuyến mãi', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        setSale((prev) => ({ ...prev, [name]: val }));
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        setSale((prev) => ({ ...prev, [name]: val }));
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Button label="Thêm mới" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Xóa" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedSales || !selectedSales.length} />
            </div>
        );
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

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tên</span>
                {rowData.name}
            </>
        );
    };

    const productBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Sản phẩm</span>
                {rowData.product_id}
            </>
        );
    };

    const discountBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Giảm giá</span>
                {rowData.discount}%
            </>
        );
    };

    const startDateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ngày bắt đầu</span>
                {new Date(rowData.start_date).toLocaleString('vi-VN')}
            </>
        );
    };

    const endDateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ngày kết thúc</span>
                {new Date(rowData.end_date).toLocaleString('vi-VN')}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editSale(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteSale(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Quản lý khuyến mãi</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    const saleDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" text onClick={saveSale} />
        </>
    );

    const deleteSaleDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteSaleDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteSale} />
        </>
    );

    const deleteSalesDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteSalesDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteSelectedSales} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={sales}
                        selection={selectedSales}
                        onSelectionChange={(e) => setSelectedSales(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} khuyến mãi"
                        globalFilter={globalFilter}
                        emptyMessage="Không tìm thấy khuyến mãi."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column header="STT" sortable body={sttBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="name" header="Tên" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="product_id" header="Sản phẩm" sortable body={productBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="discount" header="Giảm giá (%)" sortable body={discountBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="start_date" header="Ngày bắt đầu" sortable body={startDateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="end_date" header="Ngày kết thúc" sortable body={endDateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={saleDialog} style={{ width: '450px' }} header="Chi tiết khuyến mãi" modal className="p-fluid" footer={saleDialogFooter} onHide={hideDialog}>
                        {sale.id && (
                            <div className="field">
                                <label htmlFor="id">Mã khuyến mãi</label>
                                <InputText id="id" value={sale.id} disabled />
                            </div>
                        )}
                        <div className="field">
                            <label htmlFor="name">Tên khuyến mãi</label>
                            <InputText
                                id="name"
                                value={sale.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus={!sale.id}
                                className={classNames({ 'p-invalid': submitted && !sale.name })}
                            />
                            {submitted && !sale.name && <small className="p-invalid">Tên khuyến mãi là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="product_id">Mã sản phẩm</label>
                            <InputText
                                id="product_id"
                                value={sale.product_id}
                                onChange={(e) => onInputChange(e, 'product_id')}
                                required
                                className={classNames({ 'p-invalid': submitted && !sale.product_id })}
                            />
                            {submitted && !sale.product_id && <small className="p-invalid">Mã sản phẩm là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="discount">Giảm giá (%)</label>
                            <InputNumber
                                id="discount"
                                value={sale.discount}
                                onValueChange={(e) => onInputNumberChange(e, 'discount')}
                                min={0}
                                max={100}
                                required
                                className={classNames({ 'p-invalid': submitted && !sale.discount })}
                            />
                            {submitted && !sale.discount && <small className="p-invalid">Giảm giá là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="start_date">Ngày bắt đầu</label>
                            <InputText
                                id="start_date"
                                type="datetime-local"
                                value={sale.start_date ? sale.start_date.slice(0, 16) : ''} // Chuẩn hóa định dạng
                                onChange={(e) => onInputChange(e, 'start_date')}
                                required
                                className={classNames({ 'p-invalid': submitted && !sale.start_date })}
                            />
                            {submitted && !sale.start_date && <small className="p-invalid">Ngày bắt đầu là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="end_date">Ngày kết thúc</label>
                            <InputText
                                id="end_date"
                                type="datetime-local"
                                value={sale.end_date ? sale.end_date.slice(0, 16) : ''} // Chuẩn hóa định dạng
                                onChange={(e) => onInputChange(e, 'end_date')}
                                required
                                className={classNames({ 'p-invalid': submitted && !sale.end_date })}
                            />
                            {submitted && !sale.end_date && <small className="p-invalid">Ngày kết thúc là bắt buộc.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSaleDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteSaleDialogFooter} onHide={hideDeleteSaleDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {sale && (
                                <span>Bạn có chắc chắn muốn xóa khuyến mãi <b>{sale.name}</b> không?</span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSalesDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteSalesDialogFooter} onHide={hideDeleteSalesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Bạn có chắc chắn muốn xóa các khuyến mãi đã chọn không?</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Sale;